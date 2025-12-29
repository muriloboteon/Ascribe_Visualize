import { useState, useCallback } from 'react';
import { Frame, TopBar } from '@shopify/polaris';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMobileNavigationActive = useCallback(
        () => setIsMobileNavigationOpen((mobileNavigationActive) => !mobileNavigationActive),
        [],
    );

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[
                {
                    items: [{ content: 'Sign out', onAction: () => console.log('Sign out') }],
                },
            ]}
            name="Murilo"
            detail="SaaS Admin"
            initials="M"
            open={isUserMenuOpen}
            onToggle={toggleIsUserMenuOpen}
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );



    return (
        <Frame
            topBar={topBarMarkup}
            showMobileNavigation={isMobileNavigationOpen}
            onNavigationDismiss={toggleMobileNavigationActive}
        >
            {children}
        </Frame>
    );
}
