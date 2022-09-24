import React, { useState } from "react";
import axios from "../../apis/greenServer";

function Database() {
	const [file, setFile] = useState(null);

	// On file upload (click the upload button)
	const onFileUpload = () => {
		// Create an object of formData
		const formData = new FormData();

		// Update the formData object
		formData.append(
			"myFile",
			this.state.selectedFile,
			this.state.selectedFile.name
		);

		// Details of the uploaded file
		console.log(this.state.selectedFile);

		// Request made to the backend api
		// Send formData object
		axios.post("uploadfile", formData);
	};

	const clear = async () => {
		const res = await axios.get("/cleardb");
		console.log(res);
	};
	const set = async () => {
		const res = await axios.get("/setupdb");
		console.log(res);
	};
	const loadTurin = async () => {
		const res = await axios.post("/polygon/file", null, {
			params: {
				name: "Turin",
				file: "./files/Turin",
			},
		});
		console.log(res);
	};
	const loadLondon = async () => {
		const res = await axios.post("/polygon/file", null, {
			params: {
				name: "London",
				file: "./files/London",
			},
		});
		console.log(res);
	};
	const loadSanremo = async () => {
		const res = await axios.post("/polygon/file", null, {
			params: {
				name: "Sanremo",
				file: "./files/Sanremo",
			},
		});
		console.log(res);
	};
	return (
		<>
			<h1>Database</h1>
			<button onClick={() => clear()}>Clear</button>
			<button onClick={() => set()}>Set</button>
			<button onClick={() => loadTurin()}>Load Turin</button>
			<button onClick={() => loadLondon()}>Load London</button>
			<button onClick={() => loadSanremo()}>Load Sanremo</button>
			<br />
			<input type="file" onChange={(event) => setFile(event.target.files[0])} />
			<button onClick={() => onFileUpload()}>Upload!</button>
		</>
	);
}

export default Database;
