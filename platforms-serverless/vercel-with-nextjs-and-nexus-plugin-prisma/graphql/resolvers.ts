import { objectType, queryType } from 'nexus'

export const Query = queryType({
  definition(t) {
    t.crud.users()
  }
})

export const User = objectType({
  name: 'User',

  definition(t) {
    t.model.id()
    t.model.name()
  }
})

/*
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("name")
  }
})
*/
