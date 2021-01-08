// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Costume struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Picture     *string `json:"picture"`
	Location    string  `json:"location"`
	Tags        []*Tag  `json:"tags"`
}

type Tag struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Icon       *string `json:"icon"`
	Importance int     `json:"importance"`
}
