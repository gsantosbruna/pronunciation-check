# Pronunciation Check

Pronunciation Check is a web application designed to assist with pronunciation improvement. It uses Google Cloud Speech to transcribe spoken words into text and then compares them to expected text, providing feedback.

![Pronunciation Check Demo](./assets/demo.gif)

## Prerequisites

Before you can run locally Pronunciation Check, you need to complete the following steps:

1. **Cloud Platform Project**: Select or create a Cloud Platform project.
2. **Enable Cloud Speech API**: Ensure that the Cloud Speech API is enabled for your project.
3. **Authentication Setup**: Configure authentication with a service account to enable API access from your local workstation.

For detailed instructions on these prerequisites, refer to the [Cloud Speech Documentation][product-docs].

## Installation

To install and run Pronunciation Check, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Install Dependencies**: Run `npm install` to install the required dependencies.
3. **Authentication Configuration**: Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your service account key file.
4. **Start the Development Server**: Launch the development server with `npm run dev`.

## Usage

Using Pronunciation Check is straightforward:

If running on a server:

1. **Open the Application**: Access the application by navigating to [https://pronunciation-check.vercel.app/](https://pronunciation-check.vercel.app/) in your web browser.

If running locally:

1. **Open the Application**: Access the application by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.

2. **Follow On-screen Instructions**: Choose your trainings and start practicing.

Please note that Safari/iOS users will require the code to use FFmpeg in-browser conversion from mp4 to wav before sending data to the Google API, so it might take a while for the first training to load.

## Contributing

If you'd like to contribute to the project, follow these steps:

1. **Fork the Repository**: Create a fork of this repository in your GitHub account.
2. **Create a New Branch**: Make a new branch for your changes.
3. **Make Your Changes**: Implement your changes and commit them.
4. **Push Your Changes**: Push your changes to your fork.
5. **Submit a Pull Request**: Submit a pull request to the original repository to have your changes reviewed and merged.

## Technologies Used

Pronunciation Check is built with the following technologies and tools:

- **TypeScript**: Used for strong typing and improved development experience.
- **Next.js**: Provides server-side rendering and routing.
- **Google Cloud Speech**: Powers the speech-to-text functionality.
- **Node.js**: Used for server-side scripting and development.
- **FFmpeg**: Required for Safari users to perform in-browser file conversion.

These technologies work together to deliver an efficient pronunciation checking experience.
