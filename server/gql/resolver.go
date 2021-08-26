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

func (r *mutationResolver) Authenticate(ctx context.Context, password string) (bool, error) {
	res, err := r.DB.Authenticate(password)
	return res, err
}

func (r *queryResolver) Costumes(ctx context.Context, search *string) ([]*model.Costume, error) {
	return r.DB.GetCostumes(search)
}

func (r *mutationResolver) CreateCostume(ctx context.Context, costume model.CostumeCreateInput) (*model.Costume, error) {
	res, err := r.DB.InsertCostume(costume)
	return res, err
}

func (r *mutationResolver) DeleteCostume(ctx context.Context, oid string) (int, error) {
	deleteCount, err := r.DB.DeleteCostume(oid)
	return int(deleteCount), err
}

func (r *mutationResolver) UpdateCostume(ctx context.Context, oid string, costume model.CostumeUpdateInput) (*model.Costume, error) {
	res, err := r.DB.UpdateCostume(oid, costume)
	return res, err
}
