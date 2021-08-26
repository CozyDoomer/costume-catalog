package db

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/CozyDoomer/costume-catalog/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type DB interface {
	GetCostumes(search *string) ([]*model.Costume, error)
	InsertCostume(costume model.CostumeCreateInput) (*model.Costume, error)
	UpdateCostume(oid string, costume model.CostumeUpdateInput) (*model.Costume, error)
	DeleteCostume(oid string) (int64, error)
	Authenticate(password string) (bool, error)
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
func FilePathWalkDir(root string) ([]string, error) {
	var files []string
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	return files, err
}
func (db MongoDB) Authenticate(hashedPassword string) (bool, error) {
	byteHashedPassword := []byte(hashedPassword)

	content, err := ioutil.ReadFile("./password.txt")
	if err != nil {
		return false, err
	}

	// read password on server, trim newline and compare to request
	storedPassword := string(content)
	storedPassword = strings.TrimRight(storedPassword, "\n")
	byteStoredPassword := []byte(storedPassword)

	pwErr := bcrypt.CompareHashAndPassword(byteHashedPassword, byteStoredPassword)

	if pwErr == nil {
		return true, nil
	} else {
		log.Printf("Failed login attempt: %s", pwErr.Error())
		return false, nil
	}
}

func (db MongoDB) filter(search string) bson.D {
	var bsonTags []bson.D
	tags := strings.Split(search, " ")

	for _, tag := range tags {
		bsonTags = append(bsonTags, bson.D{{
			"tags.name",
			bson.D{{
				"$regex",
				"^.*" + tag + ".*$",
			}, {
				"$options",
				"i",
			}},
		}})
	}
	bsonTagsFinal := bson.D{{"$and", bsonTags}}

	fieldsBson := []bson.D{
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
	}
	finalBson := bson.D{{"$or", append(fieldsBson, bsonTagsFinal)}}

	return finalBson
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

func (db MongoDB) InsertCostume(costume model.CostumeCreateInput) (*model.Costume, error) {
	repr, _ := json.Marshal(costume)
	log.Printf("Insert Data: %s", string(repr))

	insertRes, err := db.collection.InsertOne(context.TODO(), costume)
	if err != nil {
		log.Printf("Error while inserting costume: %s", err.Error())
	}
	oid := insertRes.InsertedID.(primitive.ObjectID)
	log.Printf("ID after insert: %s", oid)

	var res *model.Costume

	err = db.collection.FindOne(context.TODO(), bson.M{"_id": oid}).Decode(&res)
	if err != nil {
		log.Printf("Error while fetching costumes: %s", err.Error())
		return nil, err
	}

	repr, _ = json.Marshal(res)
	log.Printf("Data after insert: %s", string(repr))

	return res, err
}

func (db MongoDB) DeleteCostume(oid string) (int64, error) {
	log.Printf("Delete ID: %s", oid)

	primitiveId, err := primitive.ObjectIDFromHex(oid)
	if err != nil {
		log.Println("Error while casting object id:", err.Error())
	}

	res, err := db.collection.DeleteOne(context.TODO(), bson.M{"_id": primitiveId})
	if err != nil {
		log.Printf("Error while deleting id: %s", err.Error())
	}
	deleteCount := res.DeletedCount

	return deleteCount, err
}

func (db MongoDB) UpdateCostume(oid string, costume model.CostumeUpdateInput) (*model.Costume, error) {
	repr, err := json.Marshal(costume)
	log.Printf("Update ID: %s", oid)

	primitiveId, err := primitive.ObjectIDFromHex(oid)
	if err != nil {
		log.Printf("Error while casting object id: %s", err.Error())
	}

	_, err = db.collection.ReplaceOne(context.TODO(), bson.M{"_id": primitiveId}, costume)

	if err != nil {
		log.Printf("Error while updating costume: %s", err.Error())
	}
	// updatedOID := updateRes.UpsertedID.(primitive.ObjectID)
	log.Printf("ID after update: %s", oid)

	var res *model.Costume

	err = db.collection.FindOne(context.TODO(), bson.M{"_id": primitiveId}).Decode(&res)
	if err != nil {
		log.Printf("Error while fetching updated costume: %s", err.Error())
		return nil, err
	}

	repr, _ = json.Marshal(res)
	log.Printf("Data after update: %s", string(repr))

	return res, err
}
