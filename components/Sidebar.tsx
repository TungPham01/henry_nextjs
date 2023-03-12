import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useState } from 'react'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Conversation } from '../types'
import ConversationSelect from './ConversationSelect'

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: auto;
    border-right: 1px solid whitesmoke;
`
const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;

`
const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;

`
const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`

const StyledSidebarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;

`

const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;

    }
`

const Sidebar = () => {
    const [loginUser, loading, _error] = useAuthState(auth)

    const [isOpenNewConversionDialog, setIsOpenNewConversionDialog] = useState(false)

    const [recipientEmail, setRecipientEmail] = useState('')

    const toggleNewConversionDialog = (isOpen: boolean) => {
        setIsOpenNewConversionDialog(isOpen)
        if (!isOpen) {
            setRecipientEmail('')
        }
    }

    const closeConversionDialog = () => {
        toggleNewConversionDialog(false)
    }

    const queryGetConversionForCurrentUser = query(
        collection(db, 'conversations'),
        where('users', 'array-contains', loginUser?.email)
    )

    const [conversationsSnapshot] = useCollection(queryGetConversionForCurrentUser)

    const isConversionAlreadyExists = (recipientEmail: string) =>
        conversationsSnapshot?.docs.find(conversation =>
            (conversation.data() as Conversation).users.includes(recipientEmail)
        )

    const isInvitingSelf = recipientEmail == loginUser?.email

    const createConversion = async () => {
        if (!recipientEmail) {
            return;
        }
        if (EmailValidator.validate(recipientEmail) && !isInvitingSelf && !isConversionAlreadyExists(recipientEmail)) {
            // add conversion user to db collection
            await addDoc(collection(db, 'conversations'), {
                users: [loginUser?.email, recipientEmail]
            })
        }
        closeConversionDialog()
    }

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip title={loginUser?.email as string} placement='right'>
                    <StyledUserAvatar src={loginUser?.photoURL || ''} />
                </Tooltip>

                <Box>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </Box>

            </StyledHeader>
            <StyledSearch>
                <SearchIcon />
                <StyledSearchInput placeholder='Search...' />
            </StyledSearch>
            <StyledSidebarButton onClick={() => {
                toggleNewConversionDialog(true)
            }}>
                Start a new conversion
            </StyledSidebarButton>

            {/* List of conversions */}
            {conversationsSnapshot?.docs.map(conversation => (
                <ConversationSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={(conversation.data() as Conversation).users}
                />
            ))}

            <Dialog open={isOpenNewConversionDialog} onClose={closeConversionDialog}>
                <DialogTitle>New conversion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a google email address
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientEmail}
                        onChange={event => {
                            setRecipientEmail(event.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConversionDialog}>Cancel</Button>
                    <Button disabled={!recipientEmail} onClick={createConversion}>Create</Button>
                </DialogActions>
            </Dialog>

        </StyledContainer >
    )
}
export default Sidebar