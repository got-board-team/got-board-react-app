const default_state = {};

export default (state = default_state, action) => {
  switch (action.type) {
    case 'MOVE_INFLUENCE_TOKEN':
      let id = action.id;
      if (!id) { return; }
      console.log('MOVE_INFLUENCE_TOKEN', action);
      return {...state,
        [id]: {...state[id],
          attributes: { ...state[id].attributes, ...action.attributes }
        }
      };

    default:
      return state;
  }
}
