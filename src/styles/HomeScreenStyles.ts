import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  helpButton: {
    marginLeft: 10,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#0077cc',
  },
  dailyTally: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  timestamp: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  button: {
    position: 'absolute',
    bottom: '15%',
    width: '80%',
    backgroundColor: '#6200ee',
    paddingVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default styles;
