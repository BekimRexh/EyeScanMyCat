import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  
  backgroundImage: {
    flex: 1,
  },

 
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30, 
    fontFamily: 'Chalkboard SE', 
    color: '#333',
  },
  centralCircleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText1: {
    fontSize: 18,
    color: '#e67e22', 
    fontFamily: 'Quicksand_400Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText2: {
    fontSize: 18,
    color: '#2F4F4F', 
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

  
  catImage: {
    width: 300,
    height: 300,
    borderRadius: 150, 
    marginBottom: 20,
  },
  footerImage: {
    width: 150,
    height: 80,
  },

  
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
    backgroundColor: 'rgba(92, 167, 196, 0.27)', 
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 6, 
    elevation: 8, 
    borderWidth: 0.4, 
    borderColor: 'rgba(92, 167, 196, 0.5)', 
},

  circularButtonTheme: {
    backgroundColor: '#c7e1eb', 
    borderRadius: 9999, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 },  
    shadowOpacity: 0.3, 
    shadowRadius: 6, 
    elevation: 8, 
  },
  circularButtonText: {
    fontSize: 12,
    color: '#2F4F4F', 
    fontFamily: 'Quicksand_400Regular', 
    textAlign: 'center',
    marginTop: 5,
  },

 
  iconStyle: {
    
  },

  
  circleContainer: {
    position: 'relative',
    
  },
  centralCircle: {
    borderRadius: 9999,
    backgroundColor: '#FFA500', 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    
  },
  buttonContainer: {
    alignItems: 'center',
    
  },

  
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },

  
  cameraContainer: {
    width: 300, 
    height: 300, 
    borderRadius: 150, 
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', 
  },
  camera: {
    width: '100%',
    height: '100%',
  },
});
