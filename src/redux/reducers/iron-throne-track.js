const default_state = {
  1: {
		"id": 1,
		attributes: {
      game_id: 1,
      type: 'iron_throne',
      positions: ['baratheon', 'lannister', 'tyrell', 'stark', 'greyjoy', 'martell'],
    }
  },
};

export default (state = default_state, action) => {
  switch (action.type) {

    default:
      return state;
  }
}
