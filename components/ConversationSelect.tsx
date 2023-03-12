import { Conversation } from "@/types";
import styled from "styled-components";

const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-all;

    :hover {
        background-color: #e9eaeb;
    }
`

const ConversationSelect = ({ id, conversationUsers }: { id: String; conversationUsers: Conversation['users'] }) => {
    return (
        <StyledContainer>
            {id} - {JSON.stringify(conversationUsers)}
        </StyledContainer>
    )
}

export default ConversationSelect