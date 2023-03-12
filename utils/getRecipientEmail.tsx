import { Conversation } from "@/types";
import { User } from "firebase/auth";

export const getRecipientEmail = (
    conversationUsers: Conversation['users'],
    loggedUser?: User | null
) => conversationUsers.find(userEmail => userEmail !== loggedUser?.email);