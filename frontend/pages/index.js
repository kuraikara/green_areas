import styles from '../styles/Home.module.css';
import MyMap from '../components/MyMap';

export async function getServerSideProps() {
	const res = await fetch('http://localhost:5000/h3', { method: 'GET' });
	const h3Indexes = await res.json();
	return {
		props: {
			h3Indexes,
		},
	};
}

export default function Home({ h3Indexes }) {
	return (
		<div className={styles.container}>
			<MyMap props={h3Indexes} />
		</div>
	);
}
