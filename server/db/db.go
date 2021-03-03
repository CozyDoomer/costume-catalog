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
	UpdateCostume(costume model.CostumeUpdateInput) (*model.Costume, error)
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
	safe_search := regexp.QuoteMeta(*search)
	res, err := db.collection.Find(context.TODO(), db.filter(safe_search))
	if err != nil {
		log.Printf("Error while fetching costumes: %s", err.Error())
		return nil, err
	}
	var p []*model.Costume
	err = res.All(context.TODO(), &p)
	if err != nil {
		log.Printf("Error while decoding costumes: %s", err.Error())
		return nil, err
	}
	return p, nil
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

func (db MongoDB) UpdateCostume(costume model.CostumeUpdateInput) (*model.Costume, error) {
	repr, _ := json.Marshal(costume)
	log.Printf("Data to be updated: %s", string(repr))

	insertRes, err := db.collection.InsertOne(context.TODO(), costume)
	if err != nil {
		log.Printf("Error while inserting costume: %s", err.Error())
	}
	oid := insertRes.InsertedID.(primitive.ObjectID)
	log.Printf("Updated ID: %s", oid)

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
