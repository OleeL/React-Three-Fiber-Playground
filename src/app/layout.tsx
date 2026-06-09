import type { Metadata } from 'next';
import GlobalStyle from './GlobalStyle';

export const metadata: Metadata = {
	title: 'React Three Fiber Playground',
	description: 'A React Three Fiber flight playground',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
	<html lang="en">
		<body>
			{children}
			<GlobalStyle />
		</body>
	</html>
);

export default RootLayout;
