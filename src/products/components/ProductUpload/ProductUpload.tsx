import React from 'react';
import Dropzone from "react-dropzone";
import fetch from 'node-fetch';
import { getAuthToken } from "@saleor/auth";
import {makeStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import ImageIcon from "@saleor/icons/Image";
import Typography from "@material-ui/core/Typography";
import {FormattedMessage} from "react-intl";


interface ImageUploadProps {
    children?: (props: { isDragActive: boolean }) => React.ReactNode;
    className?: string;
    disableClick?: boolean;
    isActiveClassName?: string;
    iconContainerClassName?: string;
    iconContainerActiveClassName?: string;
}



const useStyles = makeStyles(
    theme => ({
        backdrop: {
            background: fade(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main
        },
        fileField: {
            display: "none"
        },
        imageUploadActive: {
            zIndex: 1
        },

        photosIcon: {
            height: "64px",
            margin: "0 auto",
            width: "64px"
        },
        photosIconContainer: {
            padding: theme.spacing(5, 0),
            textAlign: "center"
        },
        uploadText: {
            color: theme.typography.body1.color,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase"
        }
    }),
    { name: "ProductUpload" }
);


export const ProductUpload: React.FC<ImageUploadProps> = (props) => {

    const authToken = getAuthToken()
    const classes = useStyles(props);


    return (

        <Dropzone onDrop={(acceptedFiles,rejectFile )=> {
            if(rejectFile.length){
                alert('This format is not supported')
                return;
            }
            acceptedFiles.forEach((file)=>{
                const reader = new FileReader()
                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    const binaryStr = reader.result
                    if(typeof binaryStr == 'string'){
                        const arr = binaryStr.split(',')
                        const mime = arr[0].match(/:(.*?);/)[1]
                        const bytes = atob(arr[1])
                        let n = bytes.length
                        const u8arr = new Uint8Array(n)
                        while(n--){
                            u8arr[n]=bytes.charCodeAt(n);
                        }
                        const formData = new window.FormData();
                        formData.append("file", new Blob([u8arr], {type: mime}));
                        fetch('http://127.0.0.1:8000/products/test_upload', {
                            body: formData,
                            headers: {'Authorization': `JWT ${authToken}`},
                            method: 'POST',
                        }).then(
                            () =>{
                                alert('successful to upload')
                            }
                        ).catch(
                            ()=>{
                                alert('failed to upload')
                            }
                        )
                    }
                }
                reader.readAsDataURL(file)
            })
        }}

        >
            {({ getRootProps, getInputProps}) => (
                <section>
                    <div {...getRootProps()}
                      className={classNames(classes.photosIconContainer,{
                              [classes.backdrop]: true,
                              [classes.imageUploadActive] : true
                      })}
                    >
                        <div
                            className={classNames( {
                                [classes.imageUploadActive]: true
                            })}
                        >
                            <input
                                {...getInputProps()}
                                className={classes.fileField}
                            />
                            <ImageIcon className={classes.photosIcon} />
                            <Typography className={classes.uploadText}>
                                <FormattedMessage
                                    defaultMessage="Drop here to uploadProduct"
                                    description="product upload"
                                />
                            </Typography>
                        </div>

                    </div>
                </section>
            )}
        </Dropzone>


    );
};
export default ProductUpload;
