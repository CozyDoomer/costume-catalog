package gql

import (
	"context"
	"errors"
	"testing"

	"github.com/CozyDoomer/costume-catalog/model"
	"go.mongodb.org/mongo-driver/mongo"
)

type MockDB struct {
	collection *mongo.Collection
}

func (mockDB MockDB) GetCostumes(string) ([]*model.Costume, error) {
	return []*model.Costume{{ID: "test-id"}}, errors.New("test-error")
}

func TestCostumes(t *testing.T) {
	r := &queryResolver{
		Resolver: &Resolver{&MockDB{}},
	}

	costumes, err := r.costumes(context.TODO(), "test")

	if costumes[0].ID != "test-id" {
		t.Errorf("GetCostumes() got = %v, want test-id", costumes[0].ID)
	}
	if err.Error() != "test-error" {
		t.Errorf("GetCostumes() got = %v, want test-error", err.Error())
	}
}
