package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/handler"
	"github.com/CozyDoomer/costume-catalog/cors"
	"github.com/CozyDoomer/costume-catalog/db"
	"github.com/CozyDoomer/costume-catalog/gql"
	"github.com/CozyDoomer/costume-catalog/gql/gen"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	client, err := mongo.Connect(context.TODO(), clientOptions())
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())
	http.Handle("/v1/graphql", gqlHandler(db.New(client)))
	http.Handle("/playground",
		handler.Playground("GraphQL playground", "/query"),
	)
	http.Handle("/", http.FileServer(http.Dir("/webapp")))
	err = http.ListenAndServe(":8080", nil)
	log.Println(err)
}

func gqlHandler(db db.DB) http.HandlerFunc {
	config := gen.Config{
		Resolvers: &gql.Resolver{DB: db},
	}
	gh := handler.GraphQL(gen.NewExecutableSchema(config))
	if os.Getenv("profile") != "prod" {
		gh = cors.Disable(gh)
	}
	return gh
}

func clientOptions() *options.ClientOptions {
	host := "db"
	if os.Getenv("profile") != "prod" {
		host = "localhost"
	}
	return options.Client().ApplyURI(
		"mongodb://" + host + ":27017",
	)
}
