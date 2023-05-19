import { Box, Card, Grid, Icon, IconButton, styled, Tooltip } from '@mui/material';
import clsx from 'clsx';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

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
    '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.palette.primary.main,
}));


export default function ShortcutCards({ name,url }) {
    let iconUrl = url + '/favicon.ico';
    const cardList = [
        { name: 'Google', amount: "https://www.google.com", icon: 'group' },
        { name: 'This week Sales', amount: "https://www.google.com", icon: 'attach_money' },
        { name: 'Inventory Status', amount: '8.5% Stock Surplus', icon: 'store' },
        { name: 'Orders to deliver', amount: '305 Orders', icon: 'shopping_cart' },
        { name: 'Google', amount: "https://www.google.com", icon: 'group' },
        { name: 'This week Sales', amount: '$80,500', icon: 'attach_money' },
    ];
    return (
        <Grid container direction="row" spacing={3} sx={{ mb:"1rem"}}>
            {cardList.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <StyledCard elevation={6}>
                        <ContentBox>
                            <Icon className="icon">{item.icon}</Icon>
                            <Box ml="12px">
                                <Small>{item.name}</Small>
                                <Heading>{item.amount}</Heading>
                            </Box>
                        </ContentBox>

                        <Tooltip title="edit" placement="top">
                            <ModeEditIcon></ModeEditIcon>
                        </Tooltip>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
}