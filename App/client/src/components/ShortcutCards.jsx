import { Box, Card, Grid, Icon, IconButton, styled, Menu, MenuItem, Link } from '@mui/material';
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
        { name: 'Google', url: "google.com"},
        { name: 'Microsoft', url: "microsoft.com"},
        { name: 'Google map', url: 'google.com/maps'},
        { name: 'Google Calendar', url: "calendar.google.com"},
        { name: 'StackOverflow', url: 'stackoverflow.com'},
        { name: 'Amazon', url: 'amazon.ca'},
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {;
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    return (
        <Grid container direction="row" spacing={3} sx={{ mb:"1rem"}}>
            {cards.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <StyledCard elevation={6}>
                        <ContentBox>
                            <IconButton >
                                <Icon className="icon" sx={{width:"48px",height:"48px"}}>
                                    <img alt="icon" src={iconUrlPrefix + item.url}></img>
                                </Icon>
                            </IconButton>
                            <Box ml="12px">
                                <Small>{item.name}</Small>
                                <Heading><Link href={"https://www."+item.url}>{item.url}</Link></Heading>
                            </Box>
                        </ContentBox>

                        <IconButton onClick={handleClick}>
                            <ModeEditIcon/>
                        </IconButton>
                        <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                        </Menu>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
}