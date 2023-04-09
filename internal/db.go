package main

import (
	"context"
	"os"

	"github.com/edgedb/edgedb-go"
)

func createClient(ctx context.Context) (*edgedb.Client, error) {
	opts := edgedb.Options{
		Host:        "edgedb",
		Port:        5656,
		TLSSecurity: "insecure",
		Database:    "edgedb",
		User:        "edgedb",
		Password:    edgedb.NewOptionalStr(os.Getenv("EDGEDB_PASSWORD")),
		Concurrency: 4,
	}

	return edgedb.CreateClient(ctx, opts)
}
