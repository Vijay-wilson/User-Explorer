import React, { FC, useEffect, useState } from "react"
import {
  FlatList,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import axios from "axios"
import { Text } from "@/components"
import { AntDesign, Feather } from "@expo/vector-icons"
import { API_BASE_URL } from "service/service"

const colors = {
  background: "#F0F2F5",
  card: "#FFFFFF",
  text: "#1C1E21",
  heading: "#050505",
  tagBackground: "#E4E6EB",
  tagText: "#65676B",
  lightText: "#65676B",
  shadow: "#000000",
  primary: "#1877F2",
  secondary: "#E4E6EB",
}

const spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
}

const typography = {
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  },
}

interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

interface DemoTabScreenProps {
  route: {
    params: {
      userId: string
    }
  }
}

export const UserPostsScreen: FC<DemoTabScreenProps> = function UserPostsScreen({ route }) {
  const { userId } = route.params
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const fetchPosts = async () => {
    if (loading && page !== 0) return
    setLoading(true)
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/posts`, {
          params: {
            limit: 10,
            skip: page * 10,
          },
        }
      );
      const newPosts = response.data.posts
      setPosts((prevPosts) => [...prevPosts, ...newPosts])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const renderPost = ({ item }: { item: Post }) => (
    <View style={$postItem}>
      <Text style={$postTitle}>{item.title}</Text>
      <Text style={$postBody}>{item.body}</Text>
      <View style={$tagsContainer}>
        {item.tags.map((tag, index) => (
          <TouchableOpacity key={index} style={$tagButton}>
            <Text style={$tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={$statsContainer}>
        <TouchableOpacity style={$reactionButton}>
          <AntDesign name="like1" size={20} color={colors.primary} />
          <Text style={$reactionText}>{item.reactions.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={$reactionButton}>
          <AntDesign name="dislike1" size={20} color={colors.lightText} />
          <Text style={$reactionText}>{item.reactions.dislikes}</Text>
        </TouchableOpacity>
        <View style={$viewsContainer}>
          <Feather name="eye" size={20} color={colors.lightText} />
          <Text style={$viewsText}>{item.views}</Text>
        </View>
      </View>
    </View>
  )

  const renderContent = () => {
    if (loading && posts.length === 0) {
      return (
        <View style={$loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )
    }

    if (posts.length === 0) {
      return (
        <View style={$noPostsContainer}>
          <Text style={$noPostsText}>No posts available</Text>
        </View>
      )
    }

    return (
      <>
        <View style={$header}>
          <Text style={$title}>User Posts</Text>
        </View>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchPosts}
          onEndReachedThreshold={0.1}
          contentContainerStyle={$listContainer}
          // ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        />
      </>
    )
  }

  return <View style={$container}>{renderContent()}</View>
}
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.medium,
  marginVertical: spacing.large,
}

const $title: TextStyle = {
  ...typography.header,
  color: colors.text,
}

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.medium,
}

const $postItem: ViewStyle = {
  marginBottom: spacing.large,
  padding: spacing.medium,
  backgroundColor: colors.card,
  borderRadius: 12,
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

const $postTitle: TextStyle = {
  ...typography.header,
  marginBottom: spacing.small,
  color: colors.heading,
}

const $postBody: TextStyle = {
  ...typography.body,
  color: colors.text,
  marginBottom: spacing.medium,
}

const $tagsContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: spacing.medium,
}

const $tagButton: ViewStyle = {
  backgroundColor: colors.tagBackground,
  borderRadius: 16,
  paddingVertical: spacing.tiny,
  paddingHorizontal: spacing.small,
  marginRight: spacing.tiny,
  marginBottom: spacing.tiny,
}

const $tagText: TextStyle = {
  ...typography.caption,
  color: colors.tagText,
}

const $statsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: colors.tagBackground,
  paddingTop: spacing.small,
}

const $reactionButton: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  padding: spacing.small,
}

const $reactionText: TextStyle = {
  ...typography.caption,
  color: colors.lightText,
  marginLeft: spacing.tiny,
}

const $viewsContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $viewsText: TextStyle = {
  ...typography.caption,
  color: colors.lightText,
  marginLeft: spacing.tiny,
}

const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $noPostsContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $noPostsText: TextStyle = {
  ...typography.body,
  color: colors.lightText,
}
