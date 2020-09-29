import React from 'react';
import {getAuthToken} from "@saleor/auth";
// import fetch from 'node-fetch';
// import { saveAs } from 'file-saver';
import Typography from "@material-ui/core/Typography";
import {FormattedMessage} from "react-intl";




export const ProductDownloadExcels: React.FC<any> = () => {

    const authToken = getAuthToken()
    const handleClick = ()=>{
        const formData = new window.FormData();
        formData.append("primary_categories", 'Glasses');
        formData.append("secondary_category", 'Sunglasses');
        // fetch('http://127.0.0.1:8000/products/download_excel',{
        //     method: 'POST',
        //     headers: {'Authorization': `JWT ${authToken}`},
        //     body: formData,
        //     responseType:'blob'
        // }).then((res)=>{
        //     alert(res)
        //     try {
        //         saveAs(new File([res],'test.txt',{type: "text/plain;charset=utf-8"}))
        //     }catch (e) {
        //         alert(e)
        //     }
        //
        // });
        const req = new XMLHttpRequest()
        req.open('POST','http://127.0.0.1:8000/products/download_excel',true);
        req.responseType = 'blob'
        // req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('Authorization', `JWT ${authToken}`);

        req.onload = ()=>{
            const data = req.response;
            // const a = document.createElement('a');
            const blob = new Blob([data]);
            const blobUrl = window.URL.createObjectURL(blob)
            download(blobUrl);
        }
        req.send(formData);
    };
    const download = (blobUrl)=>{
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = 'test.xls';
        a.href = blobUrl;
        a.click();
        document.body.removeChild(a);
    }


    return (
        <button
            onClick={handleClick}
        >
            <Typography>
                <FormattedMessage
                    defaultMessage="Click to download the template"
                    description="product upload"
                />
            </Typography>

        </button>
    );
};
export default ProductDownloadExcels;