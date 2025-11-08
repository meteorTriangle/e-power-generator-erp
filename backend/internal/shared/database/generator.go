package database

// import (
// 	"context"
// 	"fmt"

// 	"github.com/jackc/pgx/v5"
// 	"github.com/google/uuid"
// )


// type GeneratorSpec struct {

// }

// type Generator struct {
// 	ID		int
// 	Name	string
// 	Power 	int
// 	Spec	map[string]interface{}
// 	Model	string
// }

// const createGeneratorTable string = `
// CREATE TABLE IF NOT EXISTS public.generator_model
// (
//     "ID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
//     "Name" text COLLATE pg_catalog."default" NOT NULL,
//     "Power" integer NOT NULL,
//     "Spec" json,
//     "SpecImg" path,
//     "MachineImg" path,
//     "otherImage" path[],
//     CONSTRAINT generator_model_pkey PRIMARY KEY ("ID")
// )`

