import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // General Container Styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light blue background
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // White overlay with slight transparency
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Background Image Style
  backgroundImage: {
    flex: 1,
  },

  // Title and Text Styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30, // Spacing below the title
    fontFamily: 'Chalkboard SE', // Friendlier font
    color: '#333',
  },
  centralCircleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText1: {
    fontSize: 18,
    color: '#e67e22', // Orange text
    fontFamily: 'Quicksand_400Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText2: {
    fontSize: 18,
    color: '#2F4F4F', // Dark Slate Gray text
    fontFamily: 'Quicksand_400Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#333',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  privacyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },

  // Image Styles
  catImage: {
    width: 300,
    height: 300,
    borderRadius: 150, // Rounded image
    marginBottom: 20,
  },
  footerImage: {
    width: 150,
    height: 80,
  },

  // Navigation Containers
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '40%',
    marginTop: 20,
  },
  homeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '40%',
    marginTop: 20,
  },

  // Button Styles
  buttonDesign: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    shadowColor: '#9aa7ac',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.44,
    shadowRadius: 5.0,
    elevation: 24,
  },
  buttonTheme1: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 15,
    paddingHorizontal: 34,
    backgroundColor: '#f6ddcc',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTheme2: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 15,
    paddingHorizontal: 34,
    backgroundColor: 'rgba(92, 167, 196, 0.27)', // Converted from #5ca7c445
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // External shadow
    shadowOpacity: 0.3, // Subtle shadow opacity
    shadowRadius: 6, // Smooth, blurred shadow
    elevation: 8, // Android shadow (for consistency)
    borderWidth: 0.4, // Subtle border width
    borderColor: 'rgba(92, 167, 196, 0.5)', // Subtle border color slightly darker than button bg
},

  circularButtonTheme: {
    backgroundColor: '#c7e1eb', // Adjust the color as needed
    borderRadius: 9999, // Make the button circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 6 }, // External shadow
    shadowOpacity: 0.3, // Subtle shadow opacity
    shadowRadius: 6, // Smooth, blurred shadow
    elevation: 8, // Android shadow (for consistency)
  },
  circularButtonText: {
    fontSize: 12,
    color: '#2F4F4F', // Adjust the color as needed
    fontFamily: 'Quicksand_400Regular', // Ensure this font is loaded
    textAlign: 'center',
    marginTop: 5,
  },

  // Icon Style
  iconStyle: {
    // Add any icon-specific styles here
  },

  // Circle Menu Styles
  circleContainer: {
    position: 'relative',
    // width and height are set dynamically in the component
  },
  centralCircle: {
    borderRadius: 9999,
    backgroundColor: '#FFA500', // Adjust color as needed
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // width, height, left, and top are set dynamically in the component
  },
  buttonContainer: {
    alignItems: 'center',
    // width and height are set dynamically in the component
  },

  // Footer Style
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },

  // Camera Styles
  cameraContainer: {
    width: 300, // Circle size (adjust as needed)
    height: 300, // Circle size
    borderRadius: 150, // Half of the width/height to make it circular
    overflow: 'hidden', // Ensures the camera fits inside the circle
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Background color to avoid showing the square preview
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});
