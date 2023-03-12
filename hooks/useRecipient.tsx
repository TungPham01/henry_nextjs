import { auth } from "@/config/firebase";
import { Conversation } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";

export const useRecipient = (conversationUsers: Conversation['users']) => {
    const [loggedInUser] = useAuthState(auth)
}