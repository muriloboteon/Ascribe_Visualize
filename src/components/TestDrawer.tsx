import { Page, Card, BlockStack, Button, Text } from '@shopify/polaris';
import { useState } from 'react';
import { ResponseDrawer } from './ResponseDrawer';
import { ResponseDrawerTooltip } from './ResponseDrawerTooltip';
import { ResponseDrawerV3 } from './ResponseDrawerV3';

export function TestDrawer() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerVersion, setDrawerVersion] = useState<'v1' | 'v2' | 'v3'>('v1');

    const handleOpenV1 = () => {
        setDrawerVersion('v1');
        setIsDrawerOpen(true);
    };

    const handleOpenV2 = () => {
        setDrawerVersion('v2');
        setIsDrawerOpen(true);
    };

    const handleOpenV3 = () => {
        setDrawerVersion('v3');
        setIsDrawerOpen(true);
    };

    return (
        <Page title="Test Drawer Area">
            {/* Render the selected drawer version */}
            {drawerVersion === 'v1' && (
                <ResponseDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}

            {drawerVersion === 'v2' && (
                <ResponseDrawerTooltip
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}

            {drawerVersion === 'v3' && (
                <ResponseDrawerV3
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}

            <Card>
                <div style={{ padding: '20px' }}>
                    <BlockStack gap="400">
                        <Text as="p" variant="bodyMd">
                            Select a variation to test the "Applied Codes" interaction model:
                        </Text>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Button variant="primary" onClick={handleOpenV1}>
                                Open Drawer V1 (Card Hover)
                            </Button>

                            <Button variant="secondary" onClick={handleOpenV2}>
                                Open Drawer V2 (Tooltip on Details)
                            </Button>

                            <Button onClick={handleOpenV3}>
                                Open Drawer V3 (Global Toggle)
                            </Button>
                        </div>

                        <div style={{ marginTop: '20px', padding: '12px', background: '#f4f6f8', borderRadius: '4px' }}>
                            <Text as="p" variant="bodySm" tone="subdued">
                                <strong>V1 (Card Hover):</strong> List of codes on the bottom. Hovering a card highlights the text.<br />
                                <strong>V2 (Tooltip):</strong> Detail view has dashed underline. Hover shows Tooltip + Edit.<br />
                                <strong>V3 (Global Toggle):</strong> List view based. Toggle "Show Analysis" to reveal all interactive highlights (Coded & Uncoded).
                            </Text>
                        </div>
                    </BlockStack>
                </div>
            </Card>
        </Page>
    );
}
