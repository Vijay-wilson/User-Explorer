import React, { FC, useEffect, useState } from "react"
import {
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  StatusBar,
  TextInput,
} from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import axios from "axios"
import { FontAwesome5 } from "@expo/vector-icons"
import { API_BASE_URL } from "service/service"

interface User {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: { color: string; type: string }
  domain: string
  ip: string
  address: {
    address: string
    city: string
    coordinates: { lat: number; lng: number }
    postalCode: string
    state: string
    stateCode: string
    country: string
  }
  macAddress: string
  university: string
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company: {
    address: {
      address: string
      city: string
      coordinates: { lat: number; lng: number }
      postalCode: string
      state: string
      stateCode: string
      country: string
    }
    department: string
    name: string
    title: string
  }
  ein: string
  ssn: string
  userAgent: string
  crypto: { coin: string; wallet: string; network: string }
  role: string
}

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen({ navigation }) {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [expandedUsers, setExpandedUsers] = useState<{ [key: number]: boolean }>({})
    const [searchQuery, setSearchQuery] = useState("")

    const fetchUsers = async () => {
      if (loading || (searchQuery && filteredUsers.length === 0)) return
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: {
            limit: 10,
            skip: page * 10,
          },
        });
        const newUsers = response.data.users
        setUsers((prevUsers) => [...prevUsers, ...newUsers])
        setPage((prevPage) => prevPage + 1)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchUsers()
    }, [])

    useEffect(() => {
      const sorted = [...users].sort((a, b) => a.firstName.localeCompare(b.firstName))
      const filtered = sorted.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }, [users, searchQuery])

    const toggleExpand = (userId: number) => {
      setExpandedUsers((prev) => ({
        ...prev,
        [userId]: !prev[userId],
      }))
    }

    const DetailItem: FC<{ icon: string; value: string }> = ({ icon, value }) => (
      <View style={styles.detailItem}>
        <FontAwesome5 name={icon} size={18} color="#091057" style={styles.icon} />
        <Text style={styles.detailText}>{value}</Text>
      </View>
    )

    const renderUser = ({ item }: { item: User }) => {
      const isExpanded = expandedUsers[item.id] || false

      return (
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => navigation.navigate("userPost", { userId: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.userImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
            <DetailItem icon="user" value={item.username} />
            <DetailItem icon="envelope" value={item.email} />
            <DetailItem icon="phone" value={item.phone} />

            {isExpanded && (
              <>
                <DetailItem
                  icon="birthday-cake"
                  value={`${item.birthDate} (${item.age} years old)`}
                />
                <DetailItem icon="venus-mars" value={item.gender} />
                <DetailItem icon="user-circle" value={`Maiden Name: ${item.maidenName}`} />
                <DetailItem icon="tint" value={`Blood Group: ${item.bloodGroup}`} />
                <DetailItem icon="eye" value={`Eye Color: ${item.eyeColor}`} />
                <DetailItem icon="ruler-vertical" value={`Height: ${item.height} cm`} />
                <DetailItem icon="weight" value={`Weight: ${item.weight} kg`} />
                <DetailItem icon="cut" value={`Hair: ${item.hair.color}, ${item.hair.type}`} />
                <DetailItem icon="building" value={item.company.name} />
                <DetailItem icon="briefcase" value={item.company.title} />
                <DetailItem
                  icon="map-marker-alt"
                  value={`${item.address.address}, ${item.address.city}, ${item.address.state}, ${item.address.country}`}
                />
                <DetailItem icon="graduation-cap" value={item.university} />
                <DetailItem
                  icon="credit-card"
                  value={`${item.bank.cardType} (expires ${item.bank.cardExpire})`}
                />
                <DetailItem icon="money-bill-wave" value={`Currency: ${item.bank.currency}`} />
                <DetailItem icon="piggy-bank" value={`IBAN: ${item.bank.iban}`} />
                <DetailItem icon="network-wired" value={`MAC: ${item.macAddress}`} />
                <DetailItem icon="globe" value={`IP: ${item.ip}`} />
                <DetailItem icon="id-badge" value={`EIN: ${item.ein}`} />
                <DetailItem icon="id-card-alt" value={`SSN: ${item.ssn}`} />
                <DetailItem icon="bitcoin" value={`${item.crypto.coin} (${item.crypto.network})`} />
                <DetailItem icon="user-tag" value={`Role: ${item.role}`} />
              </>
            )}

            <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.expandButton}>
              <Text style={styles.expandButtonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
              <FontAwesome5
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={14}
                color="#091057"
                style={styles.expandIcon}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )
    }

    const renderFooter = () => {
      if (loading && filteredUsers.length > 0) {
        return (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )
      }
      return null
    }

    const renderEmptyList = () => {
      if (searchQuery && !loading) {
        return (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No results found</Text>
          </View>
        )
      }
      return null
    }

    return (
      <Screen style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchUsers}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContentContainer}
        />
      </Screen>
    )
  }

const styles = {
  title: {
    marginBottom: 16,
    textAlign: "center" as const,
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#333",
    marginTop: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // marginTop: 8,
  } as ViewStyle,
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: "center" as const,
  } as ImageStyle,
  userInfo: {
    flex: 1,
  } as ViewStyle,
  userName: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginBottom: 8,
    color: "#333",
    textAlign: "center" as const,
  } as TextStyle,
  userDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  } as TextStyle,
  expandButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  } as ViewStyle,
  expandButtonText: {
    color: "#091057",
    fontWeight: "bold" as const,
    marginRight: 4,
  } as TextStyle,
  expandIcon: {
    marginLeft: 4,
  } as TextStyle,
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 12,
    width: 22,
  },
  detailText: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 16,
  } as ViewStyle,
  searchIcon: {
    marginRight: 10,
  } as ViewStyle,
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  } as TextStyle,
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#D2E0FB",
  } as ViewStyle,

  listContentContainer: {
    paddingBottom: 200,
  } as ViewStyle,

  loader: {
    marginVertical: 20,
    alignItems: "center" as const,
  } as ViewStyle,
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  } as ViewStyle,

  emptyListText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  } as TextStyle,
}
