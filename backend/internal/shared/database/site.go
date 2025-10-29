package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

const addSiteSql string = `
INSERT INTO site (site_name, site_address, site_contact)
VALUES ($1, $2, $3)`

const listAllSiteSql string = `
SELECT id, site_name, site_address, site_contact
FROM site
ORDER BY id`

const updateSiteSql string = `
UPDATE site
SET site_name = $1, site_address = $2, site_contact = $3
WHERE id = $4
`

const delSiteSql string = `
DELETE FROM site
WHERE id = $1`

type Site struct {
	ID				int
	Name			string
	Address 		string
	Contact_json	string	
}

func SiteAdd(newSite Site) error{
	err := pool.Ping(context.Background())
	if err!=nil {
		return fmt.Errorf("connect to database failed : %w", err)
	}
	_, err = pool.Exec(
		context.Background(), addSiteSql,
		newSite.Name,
		newSite.Address,
		newSite.Contact_json,
	)
	if err != nil {
		return fmt.Errorf("add new site failed: %w", err)
	}
	return nil
}

func SiteListAll() ([]Site, error) {
	rows, err := pool.Query(context.Background(), listAllSiteSql)
	if err != nil {
		return nil, fmt.Errorf("pool.Query failed: %w", err)
	}
	site, err := pgx.CollectRows(rows, pgx.RowToStructByPos[Site])
	if err != nil {
		return nil, fmt.Errorf("CollectRows failed: %w", err)
	}
	return site, nil
}

func SiteUpdateSelect(target Site) (error) {
	cmdTag, err := pool.Exec(context.Background(), updateSiteSql,
		target.Name,
		target.Address,
		target.Contact_json,
		target.ID,
	)
	if err != nil {
		return fmt.Errorf("pool.Exec failed: %w", err)
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("no rows were updated (ID %d might not exist)", target.ID)
	}

	fmt.Printf("Successfully updated status for generator %d\n", target.ID)
	return nil
}

func SiteDel(target Site) (error) {
	cmdTag, err := pool.Exec(context.Background(), delSiteSql,
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