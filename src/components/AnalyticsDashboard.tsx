import {
    Page,
    Layout,
    LegacyCard,
    BlockStack,
    Text
} from '@shopify/polaris';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LabelList,
    Label,
    Cell
} from 'recharts';
import { useState, useCallback } from 'react';

import { ChartActions } from './ChartActions';
import { DetailsDrawer } from './DetailsDrawer';

const coOccurrenceData = [
    { name: 'Locker rooms dirty and unclean / Bathrooms dirty and unsanitary', value: 35, label: '35 - 2.1%' },
    { name: 'Exercise equipment broken and unrepaired / Gym equipment outdated', value: 30, label: '30 - 1.8%' },
    { name: 'Paper towels frequently unavailable / Cleaning supplies insufficient', value: 28, label: '28 - 1.7%' },
    { name: 'Staff helpful and professional / Staff friendly and welcoming', value: 28, label: '28 - 1.7%' },
    { name: 'Locker rooms dirty and unclean / Shower areas and facilities dirty', value: 21, label: '21 - 1.3%' },
    { name: 'Front desk staff not greeting members / Staff unfriendly', value: 21, label: '21 - 1.3%' },
    { name: 'Locker rooms dirty and unclean / Lockers broken and need repair', value: 18, label: '18 - 1.1%' },
    { name: 'Bathrooms dirty and unsanitary / Equipment cleaning irregular', value: 18, label: '18 - 1.1%' },
    { name: 'Exercise equipment broken and unrepaired / Treadmills broken', value: 17, label: '17 - 1.0%' },
    { name: 'Gym equipment outdated / Overall facility cleanliness poor', value: 17, label: '17 - 1.0%' },
    { name: 'Facility temperature excessive / Air conditioning malfunction', value: 17, label: '17 - 1.0%' },
    { name: 'Shower areas and facilities dirty / Shower heads broken', value: 17, label: '17 - 1.0%' },
    { name: 'Weights disorganized and unracked / Weights scattered', value: 17, label: '17 - 1.0%' },
    { name: 'Exercise equipment broken / Broken machines lacking signage', value: 16, label: '16 - 1.0%' },
    { name: 'Bathrooms dirty and unsanitary / Paper towels unavailable', value: 16, label: '16 - 1.0%' },
    { name: 'Front desk staff not greeting members / Staff friendly', value: 16, label: '16 - 1.0%' },
    { name: 'Facility structural damage / Facility requires major renovation', value: 16, label: '16 - 1.0%' },
    { name: 'Exercise equipment broken and unrepaired / Locker rooms dirty', value: 15, label: '15 - 0.9%' },
    { name: 'Locker rooms dirty and unclean / Floors dirty throughout facility', value: 15, label: '15 - 0.9%' },
    { name: 'Bathrooms dirty and unsanitary / Shower areas and facilities dirty', value: 15, label: '15 - 0.9%' },
];

// Custom Tooltip for Recharts to match Polaris style
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #e1e3e5',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.05)'
            }}>
                <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#202223' }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ margin: 0, color: entry.color, fontSize: '13px' }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function AnalyticsDashboard() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('');
    const [drawerData, setDrawerData] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'side' | 'modal'>('side');

    const handleBarClick = useCallback((data: any) => {
        if (data && data.name) {
            if (drawerOpen && drawerTitle === data.name) {
                setDrawerOpen(false);
            } else {
                setDrawerTitle(data.name);
                setDrawerData(data);
                setDrawerOpen(true);
            }
        }
    }, [drawerOpen, drawerTitle]);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    return (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden', backgroundColor: '#f6f6f7' }}>
            <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
                <Page fullWidth>
                    <BlockStack gap="500">
                        {/* KPI Cards Section */}
                        <Layout>
                            {/* Main Charts Section */}
                            {/* Co-Occurrences Chart Section */}
                            <Layout.Section>
                                <LegacyCard sectioned>
                                    <BlockStack gap="400">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text as="h2" variant="headingMd">Murilo - 121825: Co-Occurrences - 20 items</Text>
                                            <ChartActions />
                                        </div>
                                        <div style={{ height: 600 }}>
                                            <style>{`
                                                .recharts-wrapper *:focus {
                                                    outline: none !important;
                                                }
                                                .recharts-layer:focus {
                                                    outline: none !important;
                                                }
                                            `}</style>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    layout="vertical"
                                                    data={coOccurrenceData}
                                                    margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e1e3e5" />
                                                    <XAxis
                                                        type="number"
                                                        tick={{ fontSize: 11, fill: '#6D7175' }}
                                                        axisLine={{ stroke: '#e1e3e5' }}
                                                        tickLine={{ stroke: '#e1e3e5' }}
                                                        domain={[0, 'auto']}
                                                    >
                                                        <Label value="Comments" offset={-5} position="insideBottom" style={{ fontSize: 12, fill: '#202223' }} />
                                                    </XAxis>
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        width={400}
                                                        tick={{ fontSize: 11, fill: '#202223' }}
                                                        interval={0}
                                                    />
                                                    <Tooltip
                                                        content={<CustomTooltip />}
                                                        cursor={{ fill: 'transparent' }}
                                                    />

                                                    <Bar
                                                        dataKey="value"
                                                        radius={[0, 4, 4, 0]}
                                                        name="Count"
                                                        barSize={20}
                                                        onClick={handleBarClick}
                                                        style={{ cursor: 'pointer', outline: 'none' }}
                                                    >
                                                        {coOccurrenceData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={drawerOpen && drawerTitle === entry.name ? '#8c9196' : '#454f5b'}
                                                            />
                                                        ))}
                                                        <LabelList
                                                            dataKey="label"
                                                            position="right"
                                                            style={{ fontSize: 11, fill: '#202223' }}
                                                        />
                                                    </Bar>
                                                </BarChart >
                                            </ResponsiveContainer >
                                        </div >
                                    </BlockStack >
                                </LegacyCard >
                            </Layout.Section >


                        </Layout >
                    </BlockStack >
                </Page >
            </div >
            {drawerOpen && (
                <DetailsDrawer
                    isOpen={drawerOpen}
                    onClose={handleDrawerClose}
                    title={drawerTitle}
                    details={drawerData}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            )}
        </div >
    );
}
