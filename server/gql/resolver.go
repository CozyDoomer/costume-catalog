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

func (r *Resolver) Query() gen.QueryResolver {
	return &queryResolver{r}
}

type queryResolver struct{ *Resolver }

func (r *queryResolver) Costumes(ctx context.Context, search string) ([]*model.Costume, error) {
	return r.DB.GetCostumes(search)
}
