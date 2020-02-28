import { LIKE_POST, SET_USER, SET_UNAUTHENTICATED, SET_AUTHENTICATED, LOADING_USER, UNLIKE_POST, MARK_NOTIFICATIONS_READ } from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: [],
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                ...action.payload,
                loading: false
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKE_POST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        postId: action.payload.postId
                    }
                ]
            };
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(not => not.read = true);
            return { ...state };
        case UNLIKE_POST:
            return {
                ...state,
                likes: state.likes.filter(like => like.postId !== action.payload.postId)
            };
        default:
            return state;
    }
};
