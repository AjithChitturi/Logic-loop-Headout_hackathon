import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/native";
import { Attractions, Avatar, Hotels, NotFound, Restaurants } from "../assets";
import MenuContainer from "../components/MenuContainer";
import { FontAwesome } from "@expo/vector-icons";
import ItemCarContainer from "../components/ItemCarDontainer";
import { getPlacesData, getWeatherData } from "../api";

const Discover = () => {
  const navigation = useNavigation();

  const [type, setType] = useState("restaurants");
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [viewport, setViewport] = useState({
    bl_lat: null,
    bl_lng: null,
    tr_lat: null,
    tr_lng: null,
  });
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    // Fetch places data and weather data
    getPlacesData(viewport.bl_lat, viewport.bl_lng, viewport.tr_lat, viewport.tr_lng, type)
      .then((data) => {
        setMainData(data);
        setIsLoading(false);

        getWeatherData(viewport.bl_lat, viewport.bl_lng)
          .then((weather) => {
            setWeatherData(weather);
            setIsWeatherLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsWeatherLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [viewport.bl_lat, viewport.bl_lng, viewport.tr_lat, viewport.tr_lng, type]);

  const handlePlaceSelect = (data, details = null) => {
    const geometry = details?.geometry?.viewport;
    if (geometry) {
      setViewport({
        bl_lat: geometry.southwest.lat,
        bl_lng: geometry.southwest.lng,
        tr_lat: geometry.northeast.lat,
        tr_lng: geometry.northeast.lng,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Discover</Text>
          <Text style={styles.subHeaderText}>the beauty today</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image source={Avatar} style={styles.avatarImage} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          placeholder="Search"
          fetchDetails={true}
          onPress={handlePlaceSelect}
          query={{
            key: "Api_Key", // Replace with your API key
            language: "en",
          }}
        />
      </View>

      {/* Display Weather Data */}
      <View style={styles.weatherContainer}>
        {isWeatherLoading ? (
          <ActivityIndicator size="small" color="#0B646B" />
        ) : weatherData ? (
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherText}>Weather: {weatherData.weather[0].description}</Text>
            <Text style={styles.weatherText}>Temperature: {weatherData.main.temp}°C</Text>
            <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
          </View>
        ) : (
          <Text style={styles.weatherText}>Weather data not available</Text>
        )}
      </View>

      {/* Menu Container */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B646B" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.menuContainer}>
            <MenuContainer key={"hotels"} title="Hotels" imageSrc={Hotels} type={type} setType={setType} />
            <MenuContainer key={"attractions"} title="Attractions" imageSrc={Attractions} type={type} setType={setType} />
            <MenuContainer key={"restaurants"} title="Restaurants" imageSrc={Restaurants} type={type} setType={setType} />
          </View>

          <View style={styles.topTipsContainer}>
            <View style={styles.topTipsHeader}>
              <Text style={styles.topTipsText}>Top Tips</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ChatScreen"); // Navigate to ExploreScreen
                }}
                style={styles.exploreButton}
              >
                <Text style={styles.exploreButtonText}>Explore</Text>
                <FontAwesome name="long-arrow-right" size={24} color="#A0C4C7" />
              </TouchableOpacity>
            </View>

            <View style={styles.tipsItemList}>
              {mainData?.length > 0 ? (
                mainData?.map((data, i) => (
                  <ItemCarContainer
                    key={i}
                    imageSrc={data?.photo?.images?.medium?.url || "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"}
                    title={data?.name}
                    location={data?.location_string}
                    data={data}
                  />
                ))
              ) : (
                <View style={styles.noDataContainer}>
                  <Image source={NotFound} style={styles.noDataImage} />
                  <Text style={styles.noDataText}>Oops...No Data Found</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 40,
    color: "#0B646B",
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 36,
    color: "#527283",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    resizeMode: "cover",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 4,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 20,
  },
  topTipsContainer: {
    paddingHorizontal: 2,
    marginTop: 10,
  },
  topTipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 10,
  },
  topTipsText: {
    color: "#2C7379",
    fontSize: 28,
    fontWeight: "bold",
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  exploreButtonText: {
    color: "#A0C4C7",
    fontSize: 20,
    fontWeight: "bold",
  },
  tipsItemList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  noDataContainer: {
    width: "100%",
    height: 400,
    alignItems: "center",
    justifyContent: "space-between",
  },
  noDataImage: {
    width: 32,
    height: 32,
    resizeMode: "cover",
  },
  noDataText: {
    fontSize: 20,
    color: "#428288",
    fontWeight: "bold",
  },
  weatherContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  weatherInfo: {
    padding: 10,
    backgroundColor: "#E8F3F5",
    borderRadius: 10,
  },
  weatherText: {
    fontSize: 16,
    color: "#0B646B",
    marginVertical: 5,
  },
});

export default Discover;