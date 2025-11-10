package database

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
)

type GeneratorSpec struct {
	SpecName  string `json:"SpecName"`
	SpecValue string `json:"SpecValue"`
}

type GeneratorModel struct {
	ID         int             `json:"ID"`
	Name       string          `json:"Name"`
	Power      int             `json:"Power"`
	Spec       []GeneratorSpec `json:"spec"`
	SpecImg    string          `json:"SpecImgPath"`
	MachineImg string          `json:"MachineImgPath"`
	OtherImg   []string        `json:"OtherImgPath"`
}

const createGeneratorModelTable string = `
CREATE TABLE IF NOT EXISTS public.generator_model
(
    "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Name" text COLLATE pg_catalog."default" NOT NULL,
    "Power" integer NOT NULL,
    "Spec" json,
    "SpecImg" text,
    "MachineImg" text,
    "otherImage" text[],
    CONSTRAINT generator_model_pkey PRIMARY KEY ("ID")
)`

const addGeneratorModelSql string = `
INSERT INTO public.generator_model(
	"Name", "Power", "Spec", "SpecImg", "MachineImg", "otherImage")
VALUES ($1, $2, $3, $4, $5, $6)`

const listAllGeneratorModelSql string = `
SELECT "ID", "Name", "Power", "Spec", "SpecImg", "MachineImg", "otherImage"
FROM generator_model
ORDER BY "ID"`
const getGeneratorModelByIdSql string = `
SELECT id, name, power, spec, specimg, machineimg, otherimage
FROM generator_model
WHERE id = $1`

const updateGeneratorModelSql string = `
UPDATE generator_model
SET "Name" = $1, "Power" = $2, "Spec" = $3, "SpecImg" = $4, "MachineImg" = $5, "otherImage" = $6
WHERE "ID" = $7`

const deleteGeneratorModelSql string = `
DELETE FROM generator_model
WHERE id = $1`

const QueryGeneratorModelByPowerRangeSql string = `
SELECT id, name, power, spec, specimg, machineimg, otherimage
FROM generator_model
WHERE power >= $1 AND power <= $2
ORDER BY id`

func init() {
	AddInitTableFunc(GeneratorModelTableInit)
}

func GeneratorModelTableInit() error {
	_, err := pool.Exec(context.Background(), createGeneratorModelTable)
	if err != nil {
		return fmt.Errorf("generator model table create failed: %w", err)
	}
	return nil
}

func GeneratorModelAdd(newGeneratorModel GeneratorModel) error {
	_, err := pool.Exec(
		context.Background(), addGeneratorModelSql,
		newGeneratorModel.Name,
		newGeneratorModel.Power,
		newGeneratorModel.Spec,
		newGeneratorModel.SpecImg,
		newGeneratorModel.MachineImg,
		newGeneratorModel.OtherImg,
	)
	if err != nil {
		return fmt.Errorf("add new generator model failed: %w", err)
	}
	return nil
}

func GeneratorModelListAll() ([]GeneratorModel, error) {
	rows, err := pool.Query(context.Background(), listAllGeneratorModelSql)
	if err != nil {
		return nil, fmt.Errorf("pool.Query failed: %w", err)
	}
	generatorModel, err := pgx.CollectRows(rows, pgx.RowToStructByPos[GeneratorModel])
	if err != nil {
		return nil, fmt.Errorf("CollectRows failed: %w", err)
	}
	return generatorModel, nil
}

func GeneratorModelUpdateSelect(target GeneratorModel) error {
	cmdTag, err := pool.Exec(context.Background(),
		updateGeneratorModelSql,
		target.Name,
		target.Power,
		target.Spec,
		target.SpecImg,
		target.MachineImg,
		target.OtherImg,
		target.ID,
	)
	if err != nil {
		return fmt.Errorf("pool.Exec failed: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows were updated (ID %d might not exist)", target.ID)
	}

	// fmt.Printf("Successfully updated status for generator %d\n", target.ID)
	return nil
}

func GeneratorModelDel(target GeneratorModel) error {
	cmdTag, err := pool.Exec(context.Background(), deleteGeneratorModelSql,
		target.ID,
	)
	if err != nil {
		return fmt.Errorf("pool.Exec failed: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows were deleted (ID %d might not exist)", target.ID)
	}
	return nil
}

func GeneratorModelGetById(id int) (GeneratorModel, error) {
	var generatorModel GeneratorModel
	err := pool.QueryRow(context.Background(), getGeneratorModelByIdSql, id).Scan(
		&generatorModel.ID,
		&generatorModel.Name,
		&generatorModel.Power,
		&generatorModel.Spec,
		&generatorModel.SpecImg,
		&generatorModel.MachineImg,
		&generatorModel.OtherImg,
	)
	if err != nil {
		return GeneratorModel{}, fmt.Errorf("pool.QueryRow failed: %w", err)
	}
	return generatorModel, nil
}

func GeneratorModelGetByPowerRange(minPower int, maxPower int) ([]GeneratorModel, error) {
	rows, err := pool.Query(context.Background(),
		QueryGeneratorModelByPowerRangeSql,
		minPower,
		maxPower,
	)
	if err != nil {
		return nil, fmt.Errorf("pool.Query failed: %w", err)
	}
	generatorModels, err := pgx.CollectRows(rows, pgx.RowToStructByPos[GeneratorModel])
	if err != nil {
		return nil, fmt.Errorf("CollectRows failed: %w", err)
	}
	return generatorModels, nil
}
