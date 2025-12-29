import { Button, Popover, ActionList } from '@shopify/polaris';
import { MenuVerticalIcon, ImageIcon, FileIcon, EditIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export function ChartActions() {
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const activator = (
        <Button onClick={toggleActive} variant="plain" icon={MenuVerticalIcon} accessibilityLabel="Chart options" />
    );

    return (
        <Popover
            active={active}
            activator={activator}
            onClose={toggleActive}
        >
            <ActionList
                items={[
                    {
                        content: 'Download PNG',
                        icon: ImageIcon,
                        onAction: () => console.log('Download PNG clicked'),
                    },
                    {
                        content: 'Download Excel',
                        icon: FileIcon,
                        onAction: () => console.log('Download Excel clicked'),
                    },
                    {
                        content: 'Edit Chart',
                        icon: EditIcon,
                        onAction: () => console.log('Edit Chart clicked'),
                    },
                ]}
            />
        </Popover>
    );
}
