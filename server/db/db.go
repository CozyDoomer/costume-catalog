package db

import (
	"context"
	"encoding/json"
	"log"
	"regexp"

	"github.com/CozyDoomer/costume-catalog/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DB interface {
	GetCostumes(search *string) ([]*model.Costume, error)
	InsertCostume(costume model.CostumeCreateInput) (*model.Costume, error)
	UpdateCostume(oid string, costume model.CostumeUpdateInput) (*model.Costume, error)
	DeleteCostume(oid string) (int64, error)
}

type MongoDB struct {
	collection *mongo.Collection
}

func New(client *mongo.Client) *MongoDB {
	costumes := client.Database("costumes").Collection("costumes")
	return &MongoDB{
		collection: costumes,
	}
}

func (db MongoDB) GetCostumes(search *string) ([]*model.Costume, error) {
	safeSearch := regexp.QuoteMeta(*search)
	res, err := db.collection.Find(context.TODO(), db.filter(safeSearch))
	if err != nil {
		log.Printf("Error while fetching costumes: %s", err.Error())
		return nil, err
	}
	var costumes []*model.Costume

	err = res.All(context.TODO(), &costumes)
	if err != nil {
		log.Printf("Error while decoding costumes: %s", err.Error())
		return nil, err
	}

	return costumes, nil
}

func (db MongoDB) filter(search string) bson.D {
	return bson.D{{"$or", []bson.D{
		bson.D{{
			"tags.name",
			bson.D{{
				"$regex",
				"^.*" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"name",
			bson.D{{
				"$regex",
				"^.*" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"description",
			bson.D{{
				"$regex",
				"^.*" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"location",
			bson.D{{
				"$regex",
				"^.*" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
	}}}
}

func (db MongoDB) InsertCostume(costume model.CostumeCreateInput) (*model.Costume, error) {
	repr, _ := json.Marshal(costume)
	log.Printf("Data to be inserted: %s", string(repr))

	insertRes, err := db.collection.InsertOne(context.TODO(), costume)
	if err != nil {
		log.Printf("Error while inserting costume: %s", err.Error())
	}
	oid := insertRes.InsertedID.(primitive.ObjectID)
	log.Printf("Inserted ID: %s", oid)

	var res *model.Costume

	err = db.collection.FindOne(context.TODO(), bson.M{"_id": oid}).Decode(&res)
	if err != nil {
		log.Printf("Error while fetching costumes: %s", err.Error())
		return nil, err
	}

	repr, _ = json.Marshal(res)
	log.Printf("Inserted data: %s", string(repr))

	return res, err
}

func (db MongoDB) DeleteCostume(oid string) (int64, error) {
	log.Printf("ID to be deleted: %s", oid)

    primitiveId, err := primitive.ObjectIDFromHex(oid)
	if err != nil {
        log.Printf("Error while casting object id:", err.Error())
	}

	res, err := db.collection.DeleteOne(context.TODO(), bson.M{"_id": primitiveId})
	if err != nil {
        log.Printf("Error while deleting id: %s", err.Error())
	}
    deleteCount := res.DeletedCount

	return deleteCount, err
}

func (db MongoDB) UpdateCostume(oid string, costume model.CostumeUpdateInput) (*model.Costume, error) {
	repr, _ := json.Marshal(costume)
	log.Printf("ID to be updated: %s", oid)
	log.Printf("Data to be used: %s", string(repr))

    primitiveId, err := primitive.ObjectIDFromHex(oid)
	if err != nil {
		log.Printf("Error while casting object id: %s", err.Error())
	}

	updateRes, err := db.collection.UpdateOne(context.TODO(), bson.M{"_id": primitiveId}, costume)
	if err != nil {
		log.Printf("Error while updating costume: %s", err.Error())
	}
	updatedOID := updateRes.UpsertedID.(primitive.ObjectID)
	log.Printf("Updated ID: %s", updatedOID)

	var res *model.Costume

	err = db.collection.FindOne(context.TODO(), bson.M{"_id": updatedOID}).Decode(&res)
	if err != nil {
		log.Printf("Error while fetching updated costume: %s", err.Error())
		return nil, err
	}

	return res, err
}
