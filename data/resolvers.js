const resolvers = {
  Query: {
    user(root, args, context){
      return {
        id: 1,
        fbId: "MOCK",
        name: "Ludwig",
        description: "Hallo",
        // pictures: [Picture]
        // location: Location
        // locationTime: DateTime
        // chats: [Chat]
      }
    }
  },
  User: {
    chats(user){
      return [
        { id: 1, title: 'A post', text: 'Some text', views: 2},
        { id: 2, title: 'Another post', text: 'Some other text', views: 200}
      ];
    },
  },
  Post: {
    author(post){
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    },
  },
};

export default resolvers;