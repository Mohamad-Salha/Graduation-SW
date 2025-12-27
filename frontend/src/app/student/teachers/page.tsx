"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentProfile } from "@/services/api/student/profile";

export default function StudentTeachers() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkEnrollment = async () => {
			try {
				const profile: any = await getStudentProfile();

				console.log("Teachers page - Profile check:", profile);

				// If no license, redirect to enroll
				if (!profile || !profile.chosenLicense) {
					console.log("No license found, redirecting to enroll");
					router.replace("/student/enroll");
					return;
				}

				// If already has teacher, redirect to dashboard
				if (profile.theoTeacherId) {
					console.log("Teacher already assigned, redirecting to dashboard");
					router.replace("/student/dashboard");
					return;
				}

				// Student is enrolled but has no teacher - show this page
				console.log("Student enrolled, no teacher - showing teacher selection");
				setLoading(false);
			} catch (error: any) {
				console.error("Error checking enrollment:", error);
				router.replace("/student/enroll");
			}
		};

		checkEnrollment();
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
			<div className="text-center px-4">
				<div className="mb-8">
					<div className="text-6xl mb-4">👨‍🏫</div>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Choose Your Teacher
					</h1>
					<p className="text-lg text-gray-600 max-w-md mx-auto">
						You've successfully enrolled! Next, select a teacher to guide you through your driving journey.
					</p>
				</div>
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
					<p className="text-gray-500 italic">
						Teacher selection interface coming soon...
					</p>
				</div>
			</div>
		</div>
	);
}
