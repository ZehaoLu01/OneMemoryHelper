import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'

import { useCallback, useEffect, useState } from "react";
import GoogleLogo from '../images/Google_logo.png'
import ShortcutCard from './ShortcutCard';


export default function QuickAccessComp() {
    useEffect(() => {
        var cx = 'f511c52c934a44382';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    });
    const sizeOfShortcuts = 8;
    const [shortcutUrls, setShortcutUrls] = useState(['https://www.google.com','','','','','','','']);

    const generateShortcutCard = () => {
        let cards = [];
        console.log("test");
        for (let i = 0; i < sizeOfShortcuts; i++) {
            cards.push(
                <Grid item key={i} xs={3} >
                    <ShortcutCard url={shortcutUrls[i]} ></ShortcutCard>
                </Grid>
            )
        }
        return cards;
    };

    return (
        <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item>
                <img src={GoogleLogo} />
            </Grid>
            <Grid item sx={{ width: "80%"} }>
                <div className="gcse-searchbox-only" datanewwindow="true"></div>
            </Grid>
            <Grid item container xs sx={{ width: '80%' }} spacing={3}>
                {generateShortcutCard()}
            </Grid>
           
        </Grid>
    )
}