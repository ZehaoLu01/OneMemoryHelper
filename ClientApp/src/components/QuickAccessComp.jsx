import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

import { useEffect } from "react";
import GoogleLogo from '../images/Google_logo.png'


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

    return (
        <Stack direction="column" alignItems="center">
            <img src={GoogleLogo} />
            <Box sx={{ width: "100%"} }>
                <div className="gcse-searchbox-only" datanewwindow="true"></div>
            </Box>
        </Stack>
    )
}