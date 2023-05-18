import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


export default function ShortcutCard({ name,url }) {
    let iconUrl = url + '/favicon.ico';

    return (
        <Card sx={{ maxWidth: 200, height:'100%' }}>
            <CardActionArea href={url}>
                <CardMedia
                    component="img"
                    src={iconUrl}
                    alt="image"
                    style={{ objectFit: 'contain' }}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {url}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}