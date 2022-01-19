import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/play/play_screen.dart';
import 'package:mobileapp/screens/settings/settings_screen.dart';
import 'package:mobileapp/screens/shared_widgets/fades.dart';
import 'package:mobileapp/screens/wtf/wtf_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Widget> _children = [];

  int _currentIndex = 1;

  @override
  void initState() {
    _children.add(const PlayScreen());
    _children.add(const SettingsScreen());
    _children.add(const WtfScreen());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Theme.of(context).backgroundColor,
      child: SafeArea(
        top: false,
        maintainBottomViewPadding: true,
        child: Scaffold(
          body: Stack(
            children: <Widget>[
              _children[_currentIndex],
              fadeOverlayBottom,
            ],
          ),
          backgroundColor: Theme.of(context).backgroundColor,
          bottomNavigationBar: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: <Widget>[
              NavBarItem(
                text: "Play",
                onTap: () {
                  setState(() {
                    _currentIndex = 0;
                  });
                },
                currentIndex: _currentIndex,
                selfIndex: 0,
              ),
              NavBarItem(
                text: "Settings",
                onTap: () {
                  setState(() {
                    _currentIndex = 1;
                  });
                },
                currentIndex: _currentIndex,
                selfIndex: 1,
              ),
              NavBarItem(
                text: "Wtf?",
                onTap: () {
                  setState(() {
                    _currentIndex = 2;
                  });
                },
                currentIndex: _currentIndex,
                selfIndex: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class NavBarItem extends StatefulWidget {
  const NavBarItem({
    Key? key,
    required this.text,
    required this.onTap,
    required this.currentIndex,
    required this.selfIndex,
  }) : super(key: key);

  final Function() onTap;
  final String text;
  final int currentIndex;
  final int selfIndex;

  @override
  _NavBarItemState createState() => _NavBarItemState();
}

class _NavBarItemState extends State<NavBarItem> {
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: widget.onTap,
      style: const ButtonStyle(
        enableFeedback: false,
      ),
      child: Text(
        widget.text,
        style: TextStyle(
          color: (widget.selfIndex == widget.currentIndex)
              ? AppColors.textColor
              : AppColors.textColor,
        ),
      ),
    );
  }
}
