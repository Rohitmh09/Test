import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

// Utility: Split array into chunks
const chunkArray = (arr, chunkSize) =>
    Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
        arr.slice(i * chunkSize, i * chunkSize + chunkSize)
    );

// Calculate optimal chunk size based on content width
const calculateOptimalChunkSize = (keys) => {
    const avgColumnWidth = 80; // Average column width in points
    const a4LandscapeWidth = 842 - 80; // A4 landscape width minus margins (40pt each side)
    const maxColumns = Math.floor(a4LandscapeWidth / avgColumnWidth);
    return Math.min(maxColumns, keys.length, 10); // Cap at 10 columns for readability
};

export const exportJsonToPDF = (jsonData) => {
    console.log("button click");

    if (!jsonData || jsonData.length === 0) return;

    const keys = Object.keys(jsonData[0]); // Extract headers from first object
    const optimalChunkSize = calculateOptimalChunkSize(keys);
    const columnChunks = chunkArray(keys, optimalChunkSize); // Chunk columns

    const content = [];

    columnChunks.forEach((chunk, index) => {
        // Calculate dynamic column widths
        const columnWidths = chunk.map(() => Math.floor(100 / chunk.length) + '%');

        // Header row
        const headerRow = chunk.map(key => ({
            text: key,
            style: "tableHeader"
        }));

        // Body rows with text wrapping and overflow handling
        const bodyRows = jsonData.map(row =>
            chunk.map(key => {
                let cellValue = row[key] != null ? row[key].toString() : "";
                // Truncate very long text to prevent layout issues
                if (cellValue.length > 50) {
                    cellValue = cellValue.substring(0, 47) + "...";
                }
                return {
                    text: cellValue,
                    style: "tableCell"
                };
            })
        );

        // Only add section header if there are multiple chunks
        if (columnChunks.length > 1) {
            content.push({ 
                text: `Part ${index + 1} of ${columnChunks.length}`, 
                style: "sectionHeader" 
            });
        }

        content.push({
            table: {
                headerRows: 1,
                widths: columnWidths,
                body: [headerRow, ...bodyRows],
                // Add table-level styling for better A4 fit
                dontBreakRows: false, // Allow row breaks across pages
                keepWithHeaderRows: 1 // Keep header with at least 1 data row
            },
            layout: {
                // Apply borders with better visibility
                hLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1.2 : 0.8,
                vLineWidth: (i, node) => i === 0 || i === node.table.widths.length ? 1.2 : 0.8,
                hLineColor: () => "#2c3e50",
                vLineColor: () => "#2c3e50",
                // Add padding for better readability
                paddingLeft: () => 4,
                paddingRight: () => 4,
                paddingTop: () => 3,
                paddingBottom: () => 3
            },
            margin: [0, 5, 0, 15]
        });

        // Add page break between chunks (but not after the last one)
        if (index < columnChunks.length - 1) {
            content.push({ text: "", pageBreak: "after" });
        }
    });

    const docDefinition = {
        content,
        styles: {
            sectionHeader: {
                fontSize: 12,
                bold: true,
                color: "#2c3e50",
                margin: [0, 10, 0, 8],
                alignment: "left"
            },
            tableHeader: {
                fontSize: 9,
                bold: true,
                color: "#ffffff",
                fillColor: "#34495e",
                margin: [0, 0, 0, 0],
                alignment: "center"
            },
            tableCell: {
                fontSize: 8,
                margin: [0, 0, 0, 0],
                alignment: "left"
            }
        },
        defaultStyle: {
            fontSize: 8,
            lineHeight: 1.2
        },
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [40, 60, 40, 50], // [left, top, right, bottom]

        footer: function (currentPage, pageCount) {
            return {
                columns: [
                    {
                        text: `Generated on ${new Date().toLocaleDateString()}`,
                        alignment: 'left',
                        fontSize: 8,
                        margin: [40, 0, 0, 0]
                    },
                    {
                        text: `Page ${currentPage} of ${pageCount}`,
                        alignment: 'right',
                        fontSize: 8,
                        margin: [0, 0, 40, 0]
                    }
                ],
                margin: [0, 10, 0, 0]
            };
        }
    };

    pdfMake.createPdf(docDefinition).download("DataExport.pdf");
};