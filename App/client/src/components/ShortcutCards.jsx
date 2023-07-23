import { Button, Box, Card, Grid, Icon, IconButton, styled, Menu, MenuItem, Link, DialogActions, Dialog, DialogContent, DialogTitle, DialogContentText, TextField } from '@mui/material';
import clsx from 'clsx';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useState } from 'react';

const StyledBox = styled(Box)(({ theme, textTransformStyle, ellipsis }) => ({
  textTransform: textTransformStyle || 'none',
  whiteSpace: ellipsis ? 'nowrap' : 'normal',
  overflow: ellipsis ? 'hidden' : '',
  textOverflow: ellipsis ? 'ellipsis' : '',
}));

const Small = ({ children, className, ellipsis, textTransform, ...props }) => {
    return (
        <StyledBox
            textTransformStyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="small"
            fontSize="12px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    );
};

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& small': { color: theme.palette.text.secondary },
    '& .icon': { opacity: 0.6},
}));

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.palette.primary.main,
}));


export default function ShortcutCards({ name,url }) {
    const iconUrlPrefix = 'https://www.google.com/s2/favicons?sz=32&domain_url=';
    // TODO
    // the url here is without www. If the user input sth with www, then the link will not work.
    // Maybe we need to prim the input string! Or we should use url with www.
    const [cards,setCards] = useState([
        { id: 1, name: 'Google', url: "google.com"},
        { id: 2, name: 'Microsoft', url: "microsoft.com"},
        { id: 3, name: 'Google map', url: 'google.com/maps'},
        { id: 4, name: 'Google Calendar', url: "calendar.google.com"},
        { id: 5, name: 'StackOverflow', url: 'stackoverflow.com'},
        { id: 6, name: 'Amazon', url: 'amazon.ca'},
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editDialogState, setEditDialogState] = useState({isOpen:false, id:-1});
    const isMenuOpen = Boolean(anchorEl);

    //menu logic
    //===================================================================
    const handleMenuOpen = (event) => {;
        setAnchorEl(event.currentTarget);
        setEditDialogState({...editDialogState, id:event.target.id})
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    //menu item logic
    //===================================================================
    const handleEdit = ()=>{
        setEditDialogState({...editDialogState, isOpen:true});
        handleMenuClose();
    }

    const handleDelete = ()=>{
        const newCards = cards.map((cardInArray)=>{
            // hacking
            if(cardInArray.id!=editDialogState.id){
                return cardInArray
            }
            else{
                return {...cardInArray, name:"empty", url:"empty"};
            }
        });
        setCards(newCards);
        setEditDialogState({...editDialogState, id:-1});
        handleMenuClose();
    }

    const onSubmitChange=(card, newName, newUrl)=>{
        const newCards = cards.map((cardInArray)=>{
            if(cardInArray.id!=card.id){
                return cardInArray
            }
            else{
                return {name:newName, url:newUrl};
            }
        });
        setCards(newCards);
        setEditDialogState({...editDialogState, isOpen:false, id:-1});
    }

    return (
        <Grid container direction="row" spacing={3} sx={{ mb:"1rem"}}>
            {editDialogState.isOpen && <EditCardDialog isOpen={editDialogState.isOpen} card={cards.find((card)=>card.id==editDialogState.id)} submitHandler={onSubmitChange} closeHandler={()=>setEditDialogState({isOpen:false,id:-1})}></EditCardDialog>}

            {cards.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <StyledCard elevation={6}>
                        <ContentBox>
                            <IconButton href={"https://www."+item.url}>
                                <Icon className="icon" sx={{width:"48px",height:"48px"}}>
                                    <img alt="icon" src={iconUrlPrefix + item.url}></img>
                                </Icon>
                            </IconButton>
                            <Box ml="12px">
                                <Small>{item.name}</Small>
                                <Heading><Link href={"https://www."+item.url}>{item.url}</Link></Heading>
                            </Box>
                        </ContentBox>
                        <IconButton id={item.id} onClick={handleMenuOpen}>
                            <ModeEditIcon id={item.id}/>
                        </IconButton>
                    </StyledCard>
                </Grid>
            ))}
            <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Grid>
    );
}

function EditCardDialog({isOpen, card, submitHandler, closeHandler}) {
    const [newTitle,setNewTitle] = useState(card.name);
    const [newUrl,setNewUrl] = useState(card.url);
    if(!card) return null;

    return (
      <div>
        <Dialog open={isOpen}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change the title and url.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              label="title"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={card.name}
              onChange={(e)=>{setNewTitle(e.target.value)}}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="url"
              label="url"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={card.url}
              onChange={(e)=>{setNewUrl(e.target.value)}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeHandler}>Cancel</Button>
            <Button onClick={()=>{submitHandler(card,newTitle,newUrl)}}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }