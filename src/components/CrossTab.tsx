import { LegacyCard, Text, BlockStack } from '@shopify/polaris';
import { ChartActions } from './ChartActions';

// Helper to determine text color based on background intensity
const getTextColor = (intensity: number, isHeader: boolean) => {
    if (isHeader) return '#ffffff';
    return intensity > 0.5 ? '#ffffff' : '#202223';
};

// Helper to get background color
const getBackgroundColor = (intensity: number, isHeader: boolean) => {
    if (isHeader) return '#454f5b'; // Dark Gray for category headers
    if (intensity === 0) return '#ffffff';
    // Interpolate roughly between white and the dark gray based on intensity
    // Using a simple rgba for transparency over a gray base (69, 79, 91) -> #454f5b
    return `rgba(69, 79, 91, ${intensity})`;
};

interface CellData {
    count: number | string;
    percentage?: string;
    intensity: number; // 0 to 1
}

interface RowData {
    label: string;
    isCategoryHeader?: boolean;
    data: CellData[];
}

// Columns: Label, Total, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
const columns = ['Total', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const mockData: RowData[] = [
    {
        label: 'Total',
        isCategoryHeader: false,
        data: [
            { count: 1655, intensity: 0 }, // Total
            { count: 17, intensity: 0 }, { count: 197, intensity: 0 }, { count: 94, intensity: 0 }, { count: 108, intensity: 0 },
            { count: 99, intensity: 0 }, { count: 198, intensity: 0 }, { count: 147, intensity: 0 }, { count: 192, intensity: 0 },
            { count: 220, intensity: 0 }, { count: 163, intensity: 0 }, { count: 220, intensity: 0 }
        ]
    },
    {
        label: 'Locker Rooms And Shower Cleanliness',
        isCategoryHeader: true,
        data: [
            { count: 321, percentage: '19.4%', intensity: 0.8 },
            { count: 3, percentage: '17.6%', intensity: 0.4 }, { count: 51, percentage: '25.9%', intensity: 0.6 }, { count: 26, percentage: '27.7%', intensity: 0.7 }, { count: 24, percentage: '22.2%', intensity: 0.5 },
            { count: 29, percentage: '29.3%', intensity: 0.75 }, { count: 38, percentage: '19.2%', intensity: 0.5 }, { count: 35, percentage: '23.8%', intensity: 0.6 }, { count: 34, percentage: '17.7%', intensity: 0.45 },
            { count: 43, percentage: '19.5%', intensity: 0.5 }, { count: 17, percentage: '10.4%', intensity: 0.3 }, { count: 21, percentage: '9.5%', intensity: 0.25 }
        ]
    },
    {
        label: 'Locker rooms dirty and unclean',
        data: [
            { count: 120, percentage: '7.3%', intensity: 0.2 },
            { count: '-', intensity: 0 }, { count: 19, percentage: '9.6%', intensity: 0.25 }, { count: 9, percentage: '9.6%', intensity: 0.25 }, { count: 9, percentage: '8.3%', intensity: 0.2 },
            { count: 7, percentage: '7.1%', intensity: 0.15 }, { count: 12, percentage: '6.1%', intensity: 0.15 }, { count: 12, percentage: '8.2%', intensity: 0.2 }, { count: 20, percentage: '10.4%', intensity: 0.25 },
            { count: 17, percentage: '7.7%', intensity: 0.2 }, { count: 8, percentage: '4.9%', intensity: 0.1 }, { count: 7, percentage: '3.2%', intensity: 0.1 }
        ]
    },
    {
        label: 'Bathrooms dirty and unsanitary',
        data: [
            { count: 109, percentage: '6.6%', intensity: 0.15 },
            { count: '-', intensity: 0 }, { count: 17, percentage: '8.6%', intensity: 0.2 }, { count: 13, percentage: '13.8%', intensity: 0.3 }, { count: 6, percentage: '5.6%', intensity: 0.1 },
            { count: 7, percentage: '7.1%', intensity: 0.15 }, { count: 14, percentage: '7.1%', intensity: 0.15 }, { count: 14, percentage: '9.5%', intensity: 0.2 }, { count: 13, percentage: '6.8%', intensity: 0.15 },
            { count: 16, percentage: '7.3%', intensity: 0.15 }, { count: 3, percentage: '1.8%', intensity: 0.05 }, { count: 6, percentage: '2.7%', intensity: 0.05 }
        ]
    },
    {
        label: 'Facility Odors And Overall Cleanliness',
        isCategoryHeader: true,
        data: [
            { count: 294, percentage: '17.8%', intensity: 0.75 },
            { count: 5, percentage: '29.4%', intensity: 0.8 }, { count: 66, percentage: '33.5%', intensity: 0.9 }, { count: 27, percentage: '28.7%', intensity: 0.75 }, { count: 31, percentage: '28.7%', intensity: 0.75 },
            { count: 23, percentage: '23.2%', intensity: 0.6 }, { count: 26, percentage: '13.1%', intensity: 0.35 }, { count: 29, percentage: '19.7%', intensity: 0.5 }, { count: 27, percentage: '14.1%', intensity: 0.4 },
            { count: 32, percentage: '14.5%', intensity: 0.4 }, { count: 13, percentage: '8%', intensity: 0.2 }, { count: 15, percentage: '6.8%', intensity: 0.2 }
        ]
    },
    {
        label: 'Member hygiene and facility cleanliness poor',
        data: [
            { count: 89, percentage: '5.4%', intensity: 0.1 },
            { count: 2, percentage: '11.8%', intensity: 0.3 }, { count: 18, percentage: '9.1%', intensity: 0.25 }, { count: 6, percentage: '6.4%', intensity: 0.15 }, { count: 9, percentage: '8.3%', intensity: 0.2 },
            { count: 9, percentage: '9.1%', intensity: 0.25 }, { count: 6, percentage: '3%', intensity: 0.1 }, { count: 7, percentage: '4.8%', intensity: 0.1 }, { count: 12, percentage: '6.2%', intensity: 0.15 },
            { count: 10, percentage: '4.5%', intensity: 0.1 }, { count: 5, percentage: '3.1%', intensity: 0.1 }, { count: 5, percentage: '2.3%', intensity: 0.05 }
        ]
    }
];

export function CrossTab() {
    return (
        <LegacyCard sectioned>
            <BlockStack gap="400">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="h2" variant="headingMd">Murilo - 121825: Comments - [NPS] - 15 Codes</Text>
                    <ChartActions />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '11px',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', border: '1px solid #dfe3e8', backgroundColor: '#fff', minWidth: '200px', textAlign: 'left' }}></th>
                                {columns.map((col) => (
                                    <th key={col} style={{
                                        padding: '8px',
                                        border: '1px solid #dfe3e8',
                                        backgroundColor: '#fff',
                                        textAlign: 'center',
                                        minWidth: '50px',
                                        color: '#202223',
                                        fontWeight: 600
                                    }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{
                                        padding: '8px',
                                        border: '1px solid #dfe3e8',
                                        backgroundColor: row.isCategoryHeader ? '#ffffff' : '#f9fafb', // Keep row label simple white/light
                                        fontWeight: row.isCategoryHeader || row.label === 'Total' ? 700 : 400,
                                        color: '#202223',
                                        textAlign: 'left'
                                    }}>
                                        {row.label}
                                    </td>
                                    {row.data.map((cell, cellIndex) => (
                                        <td key={cellIndex} style={{
                                            padding: '8px 4px',
                                            border: '1px solid #dfe3e8',
                                            backgroundColor: getBackgroundColor(cell.intensity, row.isCategoryHeader || false),
                                            color: getTextColor(cell.intensity, row.isCategoryHeader || false),
                                            textAlign: 'center',
                                            verticalAlign: 'middle',
                                            height: '40px'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2' }}>
                                                <span style={{ fontWeight: 700 }}>{cell.count}</span>
                                                {cell.percentage && <span style={{ fontSize: '10px', opacity: 0.9 }}>{cell.percentage}</span>}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BlockStack>
        </LegacyCard>
    );
}
