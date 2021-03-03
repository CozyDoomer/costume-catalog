package gql

import (
	"context"

	"github.com/CozyDoomer/costume-catalog/db"
	"github.com/CozyDoomer/costume-catalog/gql/gen"
	"github.com/CozyDoomer/costume-catalog/model"
)

type Resolver struct {
	DB db.DB
}

type mutationResolver struct{ *Resolver }

func (r *Resolver) Mutation() gen.MutationResolver {
	return &mutationResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *Resolver) Query() gen.QueryResolver {
	return &queryResolver{r}
}

func (r *queryResolver) Costumes(ctx context.Context, search *string) ([]*model.Costume, error) {
	return r.DB.GetCostumes(search)
}

func (r *mutationResolver) CreateCostume(ctx context.Context, input model.CostumeCreateInput) (*model.Costume, error) {
	res, err := r.DB.InsertCostume(input)
	return res, err
}

func (r *mutationResolver) UpdateCostume(ctx context.Context, input model.CostumeUpdateInput) (*model.Costume, error) {
	res, err := r.DB.UpdateCostume(input)
	return res, err
}
