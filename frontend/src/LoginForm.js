import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import api from "./services/api";
import { setAuthToken, setUserData } from "./utils/auth";

const LoginForm = () => {
	const { userType } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const backgroundConfig = {
		Manager:
			"https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
		Trainers:
			"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
		Teachers:
			"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
		Students:
			"https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
	};

	const icons = {
		Manager: "👨‍💼",
		Trainers: "🚗",
		Teachers: "👨‍🏫",
		Students: "👨‍🎓",
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.username || !formData.password) {
			alert("Please enter both username and password");
			return;
		}

		// Handle Manager login using API
		if (userType === "Manager") {
			try {
				const result = await api.auth.login(
					formData.username,
					formData.password
				);

				// Check if the user is actually an admin
				if (result.user.role !== "admin") {
					alert("❌ Access denied. Admin credentials required.");
					return;
				}

				// Store token and user data
				setAuthToken(result.token);
				setUserData(result.user);

				alert("✅ Login successful!");
				navigate("/manager/dashboard");
			} catch (error) {
				alert(`❌ Login failed: ${error.message}`);
			}
			return;
		}

		// Handle Student login using API
		if (userType === "Students") {
			try {
				const result = await api.auth.login(
					formData.username,
					formData.password
				);

				// Check if the user is actually a student
				if (result.user.role !== "student") {
					alert("❌ Access denied. Student credentials required.");
					return;
				}

				// Store token and user data
				setAuthToken(result.token);
				setUserData(result.user);

				alert("✅ Login successful!");
				navigate("/student/dashboard");
			} catch (error) {
				alert(`❌ Login failed: ${error.message}`);
			}
			return;
		}

		// Handle Teacher login using API
		if (userType === "Teachers") {
			try {
				const result = await api.auth.login(
					formData.username,
					formData.password
				);

				// Check if the user is actually a teacher
				if (result.user.role !== "teacher") {
					alert("❌ Access denied. Teacher credentials required.");
					return;
				}

				// Store token and user data
				setAuthToken(result.token);
				setUserData(result.user);

				alert("✅ Login successful!");
				navigate("/teacher/dashboard");
			} catch (error) {
				alert(`❌ Login failed: ${error.message}`);
			}
			return;
		}

		// Handle Trainer login using API
		if (userType === "Trainers") {
			try {
				const result = await api.auth.login(
					formData.username,
					formData.password
				);

				// Check if the user is actually a trainer
				if (result.user.role !== "trainer") {
					alert("❌ Access denied. Trainer credentials required.");
					return;
				}

				// Store token and user data
				setAuthToken(result.token);
				setUserData(result.user);

				alert("✅ Login successful!");
				navigate("/trainer/dashboard");
			} catch (error) {
				alert(`❌ Login failed: ${error.message}`);
			}
			return;
		}
	};

	const handleBack = () => {
		navigate("/");
	};

	const handleSignup = () => {
		navigate("/student/signup");
	};

	return (
		<div
			className="form-container"
			style={{
				backgroundImage: `url(${backgroundConfig[userType]})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="form-overlay"></div>

			<div className="form-content">
				<button className="form-back-button" onClick={handleBack}>
					← Back
				</button>

				<div className="form-box">
					<div className="form-header">
						<div className="form-icon">{icons[userType]}</div>
						<h1 className="form-main-title">Login As {userType}</h1>
						<p className="form-sub-title">
							Alaraj Driving School System
						</p>
					</div>

					<form className="form-inputs" onSubmit={handleSubmit}>
						<div className="form-field">
							<label className="form-field-label">
								Email or Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								className="form-field-input"
								placeholder="Enter your email or username"
								required
							/>
						</div>

						<div className="form-field">
							<label className="form-field-label">Password</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="form-field-input"
								placeholder="Enter your password"
								required
							/>
						</div>

						<button type="submit" className="form-submit-btn">
							SIGN IN
						</button>

						{/* زر Signup يظهر فقط للطلاب */}
						{userType === "Students" && (
							<button
								type="button"
								className="form-signup-btn"
								onClick={handleSignup}
							>
								Don't have an account? SIGN UP
							</button>
						)}
					</form>

					<div className="form-footer">
						<p className="form-footer-text">
							Contact administration for login assistance
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
