package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"reflect"
	"testing"
)

func TestFilter(t *testing.T) {
	mongoDB := MongoDB{}

	got := mongoDB.filter("test")

	want := bson.D{{"$or", []bson.D{
		bson.D{{
			"name",
			bson.D{{
				"$regex",
				"^.*test.*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"description",
			bson.D{{
				"$regex",
				"^.*test.*$",
			}, {
				"$options",
				"i",
			}},
		}},
		bson.D{{
			"location",
			bson.D{{
				"$regex",
				"^.*test.*$",
			}, {
				"$options",
				"i",
			}},
		}},

		bson.D{{"$and", []bson.D{
			bson.D{{
				"tags.name",
				bson.D{{
					"$regex",
					"^.*test.*$",
				}, {
					"$options",
					"i",
				}},
			}},
		}}},
	},
	}}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("filter() got = %v, want %v", got, want)
	}
}
