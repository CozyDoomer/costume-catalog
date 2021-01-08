package db

import (
	"context"
	"github.com/CozyDoomer/costume-catalog/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
)

type DB interface {
	GetCostumes(search string) ([]*model.Costume, error)
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

func (db MongoDB) GetCostumes(search string) ([]*model.Costume, error) {
	res, err := db.collection.Find(context.TODO(), db.filter(search))
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
				"^" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"name",
			bson.D{{
				"$regex",
				"^" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"description",
			bson.D{{
				"$regex",
				"^" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"location",
			bson.D{{
				"$regex",
				"^" + search + ".*$",
			}, {
				"$options",
				"i",
			}},
		}},
	}}}
}
