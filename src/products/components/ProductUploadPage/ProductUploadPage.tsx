import { RawDraftContentState } from "draft-js";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
// import SaveButtonBar from "@saleor/components/SaveButtonBar";
import useFormset from "@saleor/hooks/useFormset";
import { sectionNames } from "@saleor/intl";
import { SearchCategories_search_edges_node } from "@saleor/searches/types/SearchCategories";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import { SearchProductTypes_search_edges_node_productAttributes } from "@saleor/searches/types/SearchProductTypes";
import { ProductErrorFragment } from "@saleor/attributes/types/ProductErrorFragment";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { FetchMoreProps } from "../../../types";
import {
    ProductAttributeInput,
    ProductAttributeInputData
} from "../ProductAttributes";
import { ProductStockInput } from "../ProductStocks";
import ProductUpload from "../ProductUpload";
import ProductDownloadExcels from "../ProductDownloadExcels";

interface FormData {
    basePrice: number;
    publicationDate: string;
    category: string;
    collections: string[];
    chargeTaxes: boolean;
    description: RawDraftContentState;
    isPublished: boolean;
    name: string;
    productType: string;
    seoDescription: string;
    seoTitle: string;
    sku: string;
    stockQuantity: number;
    trackInventory: boolean;
}
export interface ProductCreatePageSubmitData extends FormData {
    attributes: ProductAttributeInput[];
    stocks: ProductStockInput[];
}

interface ProductCreatePageProps {
    errors: ProductErrorFragment[];
    collections: SearchCollections_search_edges_node[];
    categories: SearchCategories_search_edges_node[];
    currency: string;
    disabled: boolean;
    fetchMoreCategories: FetchMoreProps;
    fetchMoreCollections: FetchMoreProps;
    fetchMoreProductTypes: FetchMoreProps;
    productTypes?: Array<{
        id: string;
        name: string;
        hasVariants: boolean;
        productAttributes: SearchProductTypes_search_edges_node_productAttributes[];
    }>;
    header: string;
    saveButtonBarState: ConfirmButtonTransitionState;
    warehouses: SearchWarehouses_search_edges_node[];
    fetchCategories: (data: string) => void;
    fetchCollections: (data: string) => void;
    fetchProductTypes: (data: string) => void;
    onBack?();
    onSubmit?(data: ProductCreatePageSubmitData);
}

export const ProductUploadPage: React.FC<ProductCreatePageProps> = ({
    // disabled,
    header,
    // saveButtonBarState,
    onBack,

    onSubmit
}: ProductCreatePageProps) => {

    // Form values
    const {
        data: attributes,
    } = useFormset<ProductAttributeInputData>([]);
    const {
        data: stocks
    } = useFormset<null, string>([]);

    // Ensures that it will not change after component rerenders, because it
    // generates different block keys and it causes editor to lose its content.
    const initialData: FormData = {
        basePrice: 0,
        category: "",
        chargeTaxes: false,
        collections: [],
        description: {} as any,
        isPublished: false,
        name: "",
        productType: "",
        publicationDate: "",
        seoDescription: "",
        seoTitle: "",
        sku: null,
        stockQuantity: null,
        trackInventory: false
    };

    // Display values


    const handleSubmit = (data: FormData) =>
        onSubmit({
            attributes,
            stocks,
            ...data
        });

    return (
        <Form onSubmit={handleSubmit} initial={initialData} confirmLeave>
            {
                () => {
                    const intl = useIntl();
                    return (
                        <Container>
                            <AppHeader onBack={onBack}>
                                {intl.formatMessage(sectionNames.products)}
                            </AppHeader>
                            <PageHeader title={header} />
                            <Grid>
                                <ProductUpload />
                                <ProductDownloadExcels />
                            </Grid>
                        </Container>
                    );
                }
            }
        </Form>
    );
};

ProductUploadPage.displayName = "ProductUploadPage";
export default ProductUploadPage;
