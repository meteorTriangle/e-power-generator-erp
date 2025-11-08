package database

// import (
// 	"context"
// 	"fmt"

// )

// var productTableColumn string = `
// CREATE TABLE IF NOT EXISTS public.products
// (
// 	id  PRIMARY KEY,
//     name text COLLATE pg_catalog."default",
//     description text COLLATE pg_catalog."default",
//     tags text[] COLLATE pg_catalog."default",
//     spec json,
//     class text COLLATE pg_catalog."default",
//     img path[],
//     id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 )
// )`

// var productUpsert string = `
// SELECT id
// INSERT INTO public.products (name, description, tags, spec, class, img)
// VALUES ($1, $2, $3, $4, $5, $6)
// `

// var productGetById string = `
// SELECT name, description, tags, spec, class, img
// FROM public.products
// WHERE id = $1`


// var productList string = `
// SELECT name, description, tags, spec, class, img, id
// FROM public.products
// ORDER BY name`

// var productUpdate string = `
// UPDATE public.products
// SET description = $1, tags = $2, spec = $3, class = $4, img = $5, name = $6
// WHERE id = $7`

// var productDelete string = `
// DELETE FROM public.products
// WHERE id = $1`



// func ProductTableInit() error {
// 	_, err := pool.Exec(context.Background(), productTableColumn)
// 	if err != nil {
// 		return fmt.Errorf("product table create failed: %w", err)
// 	}
// 	return nil
// }

