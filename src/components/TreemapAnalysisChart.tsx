import { LegacyCard, BlockStack, Text, Box } from '@shopify/polaris';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const data = [
    { name: 'Staff helpful and professional', size: 90, pct: '5.4%' },
    { name: 'Staff friendly and welcoming', size: 82, pct: '5%' },
    { name: 'Personal trainers highly rated', size: 72, pct: '4.4%' },
    { name: 'Overall club experience satisfaction', size: 68, pct: '4.1%' },
    { name: 'Overall gym satisfaction', size: 51, pct: '3.1%' },
    { name: 'Membership tenure long', size: 39, pct: '2.4%' },
    { name: 'Facility location convenient', size: 37, pct: '2.2%' },
    { name: 'Classes highly rated and enjoyable', size: 32, pct: '1.9%' },
    { name: 'Membership pricing affordable', size: 28, pct: '1.7%' },
    { name: 'Cleaning supplies and stations insufficient', size: 14, pct: '0.8%' },
    { name: 'Equipment variety and availability good', size: 13, pct: '0.8%' },
    { name: 'Staff assistance provided', size: 12, pct: '0.7%' },
    { name: 'Air circulation and cooling inadequate', size: 10, pct: '0.6%' },
    { name: 'Water aerobics classes valued', size: 20, pct: '1.2%' },
    { name: 'Class schedule lacks time', size: 18, pct: '1.1%' },
    { name: 'Member hygiene and facility cleanliness poor', size: 16, pct: '1.0%' },
    { name: 'Staff friendly and welcoming', size: 15, pct: '0.9%' },
    { name: 'Facility structural damage', size: 12, pct: '0.7%' },
    { name: 'Locker rooms dirty and unclean', size: 35, pct: '2.1%' },
    { name: 'Bathrooms dirty and unsanitary', size: 30, pct: '1.8%' },
];

const CustomContent = (props: any) => {
    // @ts-ignore
    const { root, depth, x, y, width, height, index, payload, colors, rank, name, value, pct } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: '#454f5b', // Neutro (Slate Dark)
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1,
                }}
            />
            {width > 50 && height > 30 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    dy={-5}
                >
                    {/* Trucate name if too long */}
                    {name.length > 20 ? name.substring(0, 18) + '...' : name}
                </text>
            ) : null}
            {width > 50 && height > 30 ? (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#rgba(255,255,255,0.8)"
                    fontSize={11}
                    dy={12}
                >
                    {value} ({pct})
                </text>
            ) : null}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #e1e3e5',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.05)'
            }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#202223' }}>{payload[0].payload.name}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6D7175' }}>
                    Count: <strong>{payload[0].value}</strong> ({payload[0].payload.pct})
                </p>
            </div>
        );
    }
    return null;
};

export function TreemapAnalysisChart() {
    return (
        <LegacyCard sectioned>
            <BlockStack gap="400">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="h2" variant="headingMd">Murilo - 121825: Comments - 50 Codes</Text>
                </div>
                <Box paddingBlockEnd="400">
                    <div style={{ height: 500, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                                data={data}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#454f5b"
                                content={<CustomContent />}
                            >
                                <Tooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                </Box>
            </BlockStack>
        </LegacyCard>
    );
}
