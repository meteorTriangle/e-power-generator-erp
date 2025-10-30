package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/google/uuid"
)


type Generator struct {
	ID		uuid.UUID
	Name	string
	Site  	int
	Model	string
}

const addGeneratorSql string = `
INSERT INTO generator (id, name, model, site)
VALUES ($1, $2, $3, $4)`

const listAllGeneratorSql string = `
SELECT id, name, model, site
FROM generator
ORDER BY model`

const updateGeneratorSql string = `
UPDATE generator
SET name = $1, model = $2, site = $3
WHERE id = $4`




func GeneratorAdd(newGenerator Generator) error{
	_, err := pool.Exec(
		context.Background(), addGeneratorSql,
		uuid.New(),
		newGenerator.Name,
		newGenerator.Model,
		newGenerator.Site,
	)
	if err != nil {
		return fmt.Errorf("add new generator failed: %w", err)
	}
	return nil
	
}

func GeneratorListAll() ([]Generator, error) {
	rows, err := pool.Query(context.Background(), listAllGeneratorSql)
	if err != nil {
		return nil, fmt.Errorf("pool.Query failed: %w", err)
	}
	generator, err := pgx.CollectRows(rows, pgx.RowToStructByPos[Generator])
	if err != nil {
		return nil, fmt.Errorf("CollectRows failed: %w", err)
	}
	return generator, nil
}

func GeneratorUpdateSelect(target Generator) error {
	_, err := pool.Exec(
		context.Background(), updateGeneratorSql,
		target.Name,
		target.Model,
		target.Site,
		target.ID,
	)
	if err != nil {
		return fmt.Errorf("update generator failed: %w", err)
	}
	return nil
} 